import { create } from 'zustand';
import type { CustomerInfo, PurchasesOfferings } from 'react-native-purchases';
import Purchases from 'react-native-purchases';
import {
  checkEntitlement,
  getOfferings,
  getCustomerInfo,
} from '@/services/revenuecat/purchaseService';
import { ENTITLEMENTS } from '@/types/subscription';

interface SubscriptionState {
  isPremium: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  checkSubscription: () => Promise<void>;
  loadOfferings: () => Promise<void>;
  setCustomerInfo: (info: CustomerInfo) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  isLoading: true,
  customerInfo: null,
  offerings: null,

  checkSubscription: async () => {
    set({ isLoading: true });
    try {
      const isPremium = await checkEntitlement();
      const customerInfo = await getCustomerInfo();
      set({ isPremium, customerInfo, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadOfferings: async () => {
    const offerings = await getOfferings();
    set({ offerings });
  },

  setCustomerInfo: (info: CustomerInfo) => {
    const isPremium = !!info.entitlements.active[ENTITLEMENTS.PREMIUM];
    set({ customerInfo: info, isPremium });
  },

  reset: () => set({ isPremium: false, isLoading: true, customerInfo: null, offerings: null }),
}));

let listenerSetup = false;

export function setupSubscriptionListener() {
  if (listenerSetup) return;
  listenerSetup = true;
  Purchases.addCustomerInfoUpdateListener((info) => {
    useSubscriptionStore.getState().setCustomerInfo(info);
  });
}

export function removeSubscriptionListener() {
  // RevenueCat SDK v9 listener persists for app lifetime
  listenerSetup = false;
}
