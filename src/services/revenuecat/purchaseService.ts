import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { ENTITLEMENTS } from '@/types/subscription';

const API_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
    : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

let isInitialized = false;

export async function initializePurchases(): Promise<boolean> {
  if (!API_KEY) {
    console.warn('RevenueCat API key not set for platform:', Platform.OS);
    return false;
  }
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey: API_KEY });
  isInitialized = true;
  return true;
}

export function isPurchasesInitialized(): boolean {
  return isInitialized;
}

export async function loginUser(userId: string) {
  if (!isInitialized) return;
  await Purchases.logIn(userId);
}

export async function logoutUser() {
  if (!isInitialized) return;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    if (!customerInfo.originalAppUserId.startsWith('$RCAnonymousID:')) {
      await Purchases.logOut();
    }
  } catch {
    // SDK not ready or already anonymous - safe to ignore
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.error('Failed to fetch offerings:', error);
    return null;
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (error: any) {
    if (error.userCancelled) {
      return null;
    }
    throw error;
  }
}

export async function checkEntitlement(
  entitlement: string = ENTITLEMENTS.PREMIUM
): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return !!customerInfo.entitlements.active[entitlement];
  } catch {
    return false;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch {
    return null;
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.restorePurchases();
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
}
