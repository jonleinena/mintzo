import { Stack } from "expo-router";

export default function ExamLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[level]/[part]" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="session/results/[id]" />
      <Stack.Screen name="free-trial" />
    </Stack>
  );
}
