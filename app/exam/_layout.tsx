import { Stack } from "expo-router";

export default function ExamLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[level]" />
      <Stack.Screen name="session" />
      <Stack.Screen name="free-trial" />
    </Stack>
  );
}
