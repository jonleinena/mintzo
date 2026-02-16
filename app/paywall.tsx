import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { PurchasesPackage } from 'react-native-purchases';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import {
  purchasePackage,
  restorePurchases,
} from '@/services/revenuecat/purchaseService';

const HARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 4,
};

const TIER_ORDER = ['$rc_monthly', '$rc_three_month', '$rc_six_month', '$rc_annual'] as const;

const TIER_META: Record<
  string,
  { label: string; months: number; savings: string | null }
> = {
  '$rc_monthly': { label: '1 Month', months: 1, savings: null },
  '$rc_three_month': { label: '3 Months', months: 3, savings: '~11% off' },
  '$rc_six_month': { label: '6 Months', months: 6, savings: '~17% off' },
  '$rc_annual': { label: '1 Year', months: 12, savings: '~22% off' },
};

function getRecommendedTier(examDateStr: string | null): string | null {
  if (!examDateStr) return null;
  const now = new Date();
  const examDate = new Date(examDateStr);
  const daysUntil = Math.ceil(
    (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil <= 45) return '$rc_monthly';
  if (daysUntil <= 135) return '$rc_three_month';
  if (daysUntil <= 270) return '$rc_six_month';
  return null;
}

const FEATURES = [
  { icon: 'mic' as const, text: 'Unlimited exam sessions' },
  { icon: 'analytics' as const, text: 'Detailed AI feedback' },
  { icon: 'trending-up' as const, text: 'Progress tracking' },
  { icon: 'people' as const, text: 'Collaborative tasks (Part 3)' },
  { icon: 'chatbubbles' as const, text: 'Discussion practice (Part 4)' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { offerings, loadOfferings, isPremium } = useSubscriptionStore();
  const { targetExamDate } = useSettingsStore();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!offerings) {
      loadOfferings();
    }
  }, []);

  useEffect(() => {
    if (isPremium && returnTo) {
      router.replace(returnTo as any);
    }
  }, [isPremium]);

  const recommended = useMemo(
    () => getRecommendedTier(targetExamDate),
    [targetExamDate]
  );

  const packages = useMemo(() => {
    if (!offerings?.current?.availablePackages) return [];
    const available = offerings.current.availablePackages;
    return TIER_ORDER
      .map((key) => available.find((p) => p.identifier === key))
      .filter(Boolean) as PurchasesPackage[];
  }, [offerings]);

  useEffect(() => {
    if (packages.length > 0 && !selectedTier) {
      setSelectedTier(recommended ?? packages[0].identifier);
    }
  }, [packages, recommended]);

  const handlePurchase = async () => {
    const pkg = packages.find((p) => p.identifier === selectedTier);
    if (!pkg) return;
    setPurchasing(true);
    try {
      const info = await purchasePackage(pkg);
      if (info) {
        useSubscriptionStore.getState().setCustomerInfo(info);
      }
    } catch (error: any) {
      Alert.alert('Purchase failed', error.message ?? 'Something went wrong');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const info = await restorePurchases();
      if (info) {
        useSubscriptionStore.getState().setCustomerInfo(info);
        const hasActive = Object.keys(info.entitlements.active).length > 0;
        if (!hasActive) {
          Alert.alert('No purchases found', 'We could not find any active subscriptions to restore.');
        }
      }
    } catch {
      Alert.alert('Restore failed', 'Please try again later.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          className="mt-2 mb-4 self-start rounded-lg border-2 border-black bg-white px-4 py-2"
          style={HARD_SHADOW}
        >
          <Ionicons name="close" size={20} color="#000" />
        </Pressable>

        {/* Header */}
        <Text className="text-3xl font-black mb-2">
          Unlock Full Exam Practice
        </Text>
        <Text className="text-base text-slate-500 mb-6">
          Part 1 is always free. Subscribe to access all exam parts and premium
          features.
        </Text>

        {/* Features */}
        <View
          className="border-2 border-black rounded-lg bg-surface-mint p-4 mb-6"
          style={HARD_SHADOW}
        >
          {FEATURES.map((f, i) => (
            <View key={i} className="flex-row items-center gap-3 mb-3 last:mb-0">
              <View className="w-8 h-8 rounded-full border-2 border-black bg-white items-center justify-center">
                <Ionicons name={f.icon} size={16} color="#000" />
              </View>
              <Text className="text-base font-medium flex-1">{f.text}</Text>
            </View>
          ))}
        </View>

        {/* Tier cards */}
        {packages.length === 0 ? (
          <ActivityIndicator size="large" className="my-8" />
        ) : (
          <View className="gap-3 mb-6">
            {packages.map((pkg) => {
              const meta = TIER_META[pkg.identifier] ?? {
                label: pkg.identifier,
                months: 1,
                savings: null,
              };
              const isSelected = selectedTier === pkg.identifier;
              const isRecommended = recommended === pkg.identifier;
              const priceStr = pkg.product.priceString;
              const price = pkg.product.price;
              const perMonth =
                meta.months > 1
                  ? `${pkg.product.currencyCode} ${(price / meta.months).toFixed(2)}/mo`
                  : null;

              return (
                <Pressable
                  key={pkg.identifier}
                  onPress={() => setSelectedTier(pkg.identifier)}
                  className={`border-2 border-black rounded-lg p-4 ${
                    isSelected ? 'bg-surface-indigo' : 'bg-white'
                  }`}
                  style={HARD_SHADOW}
                >
                  {isRecommended && (
                    <View className="self-start bg-brand-violet rounded-full px-3 py-1 mb-2">
                      <Text className="text-white text-xs font-bold">
                        Recommended
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-black">{meta.label}</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        {perMonth && (
                          <Text className="text-sm text-slate-600">
                            {perMonth}
                          </Text>
                        )}
                        {meta.savings && (
                          <View className="bg-accent-success rounded-full px-2 py-0.5">
                            <Text className="text-xs font-bold">
                              {meta.savings}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <Text className="text-xl font-black">{priceStr}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Purchase button */}
        <Pressable
          onPress={handlePurchase}
          disabled={purchasing || !selectedTier}
          className="bg-brand-violet border-2 border-black rounded-lg py-4 mb-4"
          style={{
            ...HARD_SHADOW,
            opacity: purchasing ? 0.7 : 1,
          }}
        >
          <Text className="text-white text-lg font-black text-center">
            {purchasing ? 'Processing...' : 'Subscribe'}
          </Text>
        </Pressable>

        {/* Restore */}
        <Pressable
          onPress={handleRestore}
          disabled={restoring}
          className="py-3"
        >
          <Text className="text-brand-violet text-sm font-medium text-center">
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
