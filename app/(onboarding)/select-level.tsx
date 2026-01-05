import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function SelectLevelScreen() {
  const handleSelectLevel = (_level: string) => {
    // TODO: Store level in state/context
    router.push('/(onboarding)/set-exam-date');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-md">
        <Text className="text-3xl font-bold text-text-primary mb-md">
          Which exam are you preparing for?
        </Text>
        <Text className="text-text-secondary mb-2xl">
          We&apos;ll customize your practice plan based on your target exam.
        </Text>

        <View className="gap-md flex-1">
          <Pressable
            className="p-lg bg-surface rounded-lg border-2 border-exam-b2"
            onPress={() => handleSelectLevel('B2')}
          >
            <Text className="text-2xl font-bold text-exam-b2">B2 First</Text>
            <Text className="text-text-muted mt-xs">
              Cambridge First Certificate (FCE)
            </Text>
            <Text className="text-text-secondary mt-sm">
              Upper-intermediate level • Score range: 140-190
            </Text>
          </Pressable>

          <Pressable
            className="p-lg bg-surface rounded-lg border-2 border-exam-c1"
            onPress={() => handleSelectLevel('C1')}
          >
            <Text className="text-2xl font-bold text-exam-c1">C1 Advanced</Text>
            <Text className="text-text-muted mt-xs">
              Cambridge Advanced Certificate (CAE)
            </Text>
            <Text className="text-text-secondary mt-sm">
              Advanced level • Score range: 160-210
            </Text>
          </Pressable>

          <Pressable
            className="p-lg bg-surface rounded-lg border-2 border-exam-c2"
            onPress={() => handleSelectLevel('C2')}
          >
            <Text className="text-2xl font-bold text-exam-c2">
              C2 Proficiency
            </Text>
            <Text className="text-text-muted mt-xs">
              Cambridge Proficiency Certificate (CPE)
            </Text>
            <Text className="text-text-secondary mt-sm">
              Proficient level • Score range: 180-230
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
