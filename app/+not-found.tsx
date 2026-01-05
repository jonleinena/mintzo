import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-background p-md">
        <Text className="text-xl font-bold text-text-primary mb-md">
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/" className="mt-md py-md">
          <Text className="text-primary">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
