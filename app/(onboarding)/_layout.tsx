import { Stack } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="select-level" />
      <Stack.Screen name="set-exam-date" />
      <Stack.Screen name="tutorial" />
    </Stack>
  );
}
