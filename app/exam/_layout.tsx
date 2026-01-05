import { Stack } from 'expo-router';
import { colors } from '@/constants/Colors';

export default function ExamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.DEFAULT,
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="free-trial" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="results/[id]" />
    </Stack>
  );
}
