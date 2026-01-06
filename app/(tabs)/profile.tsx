import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-2xl font-bold text-text-primary mb-lg">
          Profile
        </Text>

        {/* User Info Section */}
        <View className="p-md bg-surface rounded-lg mb-md">
          <View className="w-20 h-20 bg-surface-secondary rounded-full items-center justify-center mb-md">
            <Text className="text-3xl">👤</Text>
          </View>
          <Text className="text-lg font-semibold text-text-primary">
            Guest User
          </Text>
          <Text className="text-text-muted">Sign in to save your progress</Text>
        </View>

        {/* Exam Settings */}
        <View className="p-md bg-surface rounded-lg mb-md">
          <Text className="text-lg font-semibold text-text-primary mb-md">
            Exam Settings
          </Text>
          <View className="gap-sm">
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Target Exam</Text>
              <Text className="text-text-primary">Not set</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Exam Date</Text>
              <Text className="text-text-primary">Not set</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Daily Goal</Text>
              <Text className="text-text-primary">45 min</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-md">
          <Pressable className="p-md bg-surface rounded-lg">
            <Text className="text-text-primary">Notification Settings</Text>
          </Pressable>
          <Pressable className="p-md bg-surface rounded-lg">
            <Text className="text-text-primary">About Mintzo</Text>
          </Pressable>
          <Pressable
            className="p-md bg-primary rounded-lg"
            onPress={() => router.push('/subscription')}
          >
            <Text className="text-text-primary text-center font-semibold">
              Upgrade to Premium
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
