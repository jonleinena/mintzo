import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <Text className="text-xl font-bold">Page not found</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-[#7C3AED]">Go home</Text>
        </Link>
      </View>
    </>
  );
}
