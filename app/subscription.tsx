import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-md">
          <Text className="text-3xl font-bold text-text-primary text-center mb-md">
            Unlock Premium
          </Text>
          <Text className="text-text-secondary text-center mb-2xl">
            Get unlimited practice and detailed feedback to ace your exam
          </Text>

          {/* Features */}
          <View className="gap-md mb-2xl">
            <FeatureItem
              icon="✓"
              title="Unlimited Practice"
              description="Practice as much as you want, up to 45 min/day"
            />
            <FeatureItem
              icon="✓"
              title="Detailed Feedback"
              description="Get personalized improvement suggestions"
            />
            <FeatureItem
              icon="✓"
              title="All Exam Levels"
              description="Access B2, C1, and C2 exam preparation"
            />
            <FeatureItem
              icon="✓"
              title="Progress Tracking"
              description="Streaks, XP, achievements, and contributions graph"
            />
            <FeatureItem
              icon="✓"
              title="Practice Plan"
              description="Personalized daily plan based on your exam date"
            />
          </View>

          {/* Pricing Cards */}
          <View className="gap-md mb-xl">
            {/* Monthly */}
            <Pressable className="p-lg bg-surface rounded-lg border border-surface-secondary">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-semibold text-text-primary">
                    Monthly
                  </Text>
                  <Text className="text-text-muted">Billed monthly</Text>
                </View>
                <Text className="text-2xl font-bold text-text-primary">
                  $9.99<Text className="text-sm text-text-muted">/mo</Text>
                </Text>
              </View>
            </Pressable>

            {/* Yearly - Recommended */}
            <Pressable className="p-lg bg-surface rounded-lg border-2 border-primary">
              <View className="absolute -top-3 right-4 bg-primary px-sm py-xs rounded">
                <Text className="text-xs font-bold text-text-primary">
                  BEST VALUE
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg font-semibold text-text-primary">
                    Yearly
                  </Text>
                  <Text className="text-text-muted">Save 33%</Text>
                </View>
                <View className="items-end">
                  <Text className="text-2xl font-bold text-text-primary">
                    $79.99<Text className="text-sm text-text-muted">/yr</Text>
                  </Text>
                  <Text className="text-text-muted text-sm">$6.67/month</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Subscribe Button */}
          <Pressable className="p-lg bg-primary rounded-lg mb-md">
            <Text className="text-text-primary text-center font-bold text-lg">
              Start Free Trial
            </Text>
          </Pressable>

          <Text className="text-text-muted text-center text-sm">
            Cancel anytime. No commitment required.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row gap-md items-start">
      <View className="w-8 h-8 bg-secondary/20 rounded-full items-center justify-center">
        <Text className="text-secondary font-bold">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-text-primary font-semibold">{title}</Text>
        <Text className="text-text-muted">{description}</Text>
      </View>
    </View>
  );
}
