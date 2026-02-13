import { useRouter } from 'expo-router';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/authStore';

export function useSubscriptionGate() {
  const { isPremium } = useSubscriptionStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const requirePremium = (targetRoute: string): boolean => {
    if (isPremium) return true;

    if (!isAuthenticated) {
      router.push({
        pathname: '/(auth)/register' as any,
        params: { returnTo: '/paywall', finalTarget: targetRoute },
      });
      return false;
    }

    router.push({
      pathname: '/paywall' as any,
      params: { returnTo: targetRoute },
    });
    return false;
  };

  return { isPremium, requirePremium };
}
