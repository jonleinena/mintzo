import { Stack } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
        headerTintColor: colors.text.primary,
        contentStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="register" options={{ title: 'Create Account' }} />
      <Stack.Screen name="set-password" options={{ title: 'Set Password' }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: 'Reset Password' }}
      />
    </Stack>
  );
}
