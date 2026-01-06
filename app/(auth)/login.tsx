import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md justify-center">
        <Text className="text-3xl font-bold text-text-primary text-center mb-2xl">
          Welcome Back
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

          <View>
            <Text className="text-text-secondary mb-xs">Password</Text>
            <TextInput
              className="p-md bg-surface rounded-lg text-text-primary"
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>

          <Pressable className="p-md bg-primary rounded-lg mt-md">
            <Text className="text-text-primary text-center font-semibold">
              Sign In
            </Text>
          </Pressable>

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text className="text-primary text-center">Forgot password?</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-2xl">
          <Text className="text-text-muted text-center mb-md">
            Don&apos;t have an account?
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable className="p-md border border-primary rounded-lg">
              <Text className="text-primary text-center font-semibold">
                Create Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
