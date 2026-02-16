import { createSupabaseAdmin } from '../_shared/supabase.ts';
import { jsonResponse, errorResponse } from '../_shared/cors.ts';

const WEBHOOK_AUTH_SECRET = Deno.env.get('REVENUECAT_WEBHOOK_SECRET');

// RevenueCat event types that affect subscription status
const ACTIVE_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'PRODUCT_CHANGE',
]);

const INACTIVE_EVENTS = new Set([
  'EXPIRATION',
  'BILLING_ISSUE',
]);

const CANCEL_EVENTS = new Set([
  'CANCELLATION',
]);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // Validate authorization
  if (WEBHOOK_AUTH_SECRET) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${WEBHOOK_AUTH_SECRET}`) {
      return errorResponse('Unauthorized', 401);
    }
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  const event = body?.event;
  if (!event) {
    return errorResponse('Missing event data');
  }

  const eventType: string = event.type;
  const appUserId: string | undefined = event.app_user_id;
  const productId: string | undefined = event.product_id;
  const entitlementIds: string[] | undefined = event.entitlement_ids;
  const expirationAtMs: number | undefined = event.expiration_at_ms;
  const purchasedAtMs: number | undefined = event.purchased_at_ms;

  // app_user_id from RevenueCat is the Supabase user ID (set via Purchases.logIn)
  if (!appUserId) {
    // Anonymous users or missing ID - skip
    return jsonResponse({ status: 'skipped', reason: 'no app_user_id' });
  }

  // Determine subscription status from event
  let status: string;
  if (ACTIVE_EVENTS.has(eventType)) {
    status = 'active';
  } else if (CANCEL_EVENTS.has(eventType)) {
    status = 'cancelled';
  } else if (INACTIVE_EVENTS.has(eventType)) {
    status = 'expired';
  } else {
    // Events we do not track (e.g. TRANSFER, SUBSCRIBER_ALIAS)
    return jsonResponse({ status: 'skipped', reason: `unhandled event: ${eventType}` });
  }

  const supabase = createSupabaseAdmin();

  const upsertData: Record<string, unknown> = {
    user_id: appUserId,
    revenuecat_user_id: event.original_app_user_id ?? appUserId,
    product_id: productId ?? null,
    entitlement: entitlementIds?.[0] ?? 'premium',
    status,
    updated_at: new Date().toISOString(),
  };

  if (purchasedAtMs) {
    upsertData.started_at = new Date(purchasedAtMs).toISOString();
  }
  if (expirationAtMs) {
    upsertData.expires_at = new Date(expirationAtMs).toISOString();
  }

  const { error } = await supabase
    .from('subscriptions')
    .upsert(upsertData, { onConflict: 'user_id' });

  if (error) {
    console.error('Failed to upsert subscription:', error);
    return errorResponse('Database error', 500);
  }

  return jsonResponse({ status: 'ok', event_type: eventType });
});
