import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md justify-center">
        <Text className="text-3xl font-bold text-text-primary text-center mb-md">
          Reset Password
        </Text>
        <Text className="text-text-secondary text-center mb-2xl">
          Enter your email and we&apos;ll send you a link to reset your password.
        </Text>

        <View className="gap-md">
          <View>
            <Text className="text-text-secondary mb-xs">Email</Text>
            <TextInput
              className="p-md bg-surface rounded-lg text-text-primary"
              placeholder="your@email.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Pressable className="p-md bg-primary rounded-lg mt-md">
            <Text className="text-text-primary text-center font-semibold">
              Send Reset Link
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
