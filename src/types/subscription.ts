export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
  id: string;
  userId: string;
  revenuecatUserId?: string;
  productId?: string;
  entitlement?: string;
  status: SubscriptionStatus;
  startedAt?: Date;
  expiresAt?: Date;
}

export const ENTITLEMENTS = {
  PREMIUM: 'premium',
} as const;

export const PRODUCTS = {
  MONTHLY: 'mintzo_monthly',
  THREE_MONTH: 'mintzo_3month',
  SIX_MONTH: 'mintzo_6month',
  YEARLY: 'mintzo_yearly',
} as const;
