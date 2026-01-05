import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md justify-center">
        <Text className="text-3xl font-bold text-text-primary text-center mb-md">
          Set Your Password
        </Text>
        <Text className="text-text-secondary text-center mb-2xl">
          Your academy has invited you to Mintzo. Create a password to secure
          your account.
        </Text>

        <View className="gap-md">
          <View>
            <Text className="text-text-secondary mb-xs">New Password</Text>
            <TextInput
              className="p-md bg-surface rounded-lg text-text-primary"
              placeholder="Create a password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-text-secondary mb-xs">Confirm Password</Text>
            <TextInput
              className="p-md bg-surface rounded-lg text-text-primary"
              placeholder="Confirm your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>

          <Pressable className="p-md bg-primary rounded-lg mt-md">
            <Text className="text-text-primary text-center font-semibold">
              Set Password & Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
