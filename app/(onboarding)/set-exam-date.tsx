import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState, useMemo } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getUpcomingMonths(): { label: string; year: number; month: number }[] {
  const now = new Date();
  const months: { label: string; year: number; month: number }[] = [];
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

const QUICK_OPTIONS = [
  { label: "In 1 month", months: 1 },
  { label: "In 3 months", months: 3 },
  { label: "In 6 months", months: 6 },
  { label: "Not sure yet", months: 0 },
];

export default function SetExamDateScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const setTargetExamDate = useSettingsStore((s) => s.setTargetExamDate);
  const upcomingMonths = useMemo(() => getUpcomingMonths(), []);

  const handleContinue = () => {
    if (selectedIndex === null) return;
    const option = QUICK_OPTIONS[selectedIndex];
    if (option.months === 0) {
      setTargetExamDate(null);
    } else {
      const target = new Date();
      target.setMonth(target.getMonth() + option.months);
      setTargetExamDate(target.toISOString().split("T")[0]);
    }
    router.push("/(onboarding)/tutorial");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Back */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <Pressable
            onPress={() => router.back()}
            className="mb-6"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: "#000",
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800" }}>←</Text>
          </Pressable>
        </Animated.View>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-2">
          <Text
            className="text-3xl mb-2"
            style={{ fontWeight: "900", color: "#000", letterSpacing: -0.5 }}
          >
            When is your exam?
          </Text>
          <Text
            className="text-base mb-8"
            style={{ fontWeight: "500", color: "#64748B" }}
          >
            We'll create a personalized practice plan for you.
          </Text>
        </Animated.View>

        {/* Quick option cards */}
        <View className="flex-1">
          {QUICK_OPTIONS.map((option, i) => {
            const isSelected = selectedIndex === i;
            const colors = ["#FEF3C7", "#D1FAE5", "#E0E7FF", "#F3F4F6"];
            const emojis = ["🏃", "📚", "🎯", "🤷"];
            return (
              <Animated.View
                key={option.label}
                entering={FadeInDown.delay(200 + i * 100).duration(500)}
              >
                <Pressable
                  onPress={() => setSelectedIndex(i)}
                  className="flex-row items-center p-4 rounded-2xl mb-3"
                  style={{
                    backgroundColor: colors[i],
                    borderWidth: 2,
                    borderColor: "#000",
                    shadowColor: isSelected ? "#7C3AED" : "#000",
                    shadowOffset: {
                      width: isSelected ? 4 : 2,
                      height: isSelected ? 4 : 2,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: isSelected ? 5 : 2,
                  }}
                >
                  <View
                    className="items-center justify-center mr-4"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#FFF",
                      borderWidth: 1.5,
                      borderColor: "#000",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{emojis[i]}</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-base"
                      style={{ fontWeight: "800", color: "#000" }}
                    >
                      {option.label}
                    </Text>
                    {option.months > 0 && (
                      <Text
                        className="text-xs mt-0.5"
                        style={{ fontWeight: "600", color: "#64748B" }}
                      >
                        ~{option.months * 30} days of practice
                      </Text>
                    )}
                  </View>
                  {/* Radio */}
                  <View
                    className="items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: "#000",
                      backgroundColor: isSelected ? "#7C3AED" : "transparent",
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#FFF",
                        }}
                      />
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Continue */}
        <Animated.View entering={FadeInUp.delay(650).duration(500)} className="mb-8">
          <Pressable
            onPress={handleContinue}
            disabled={selectedIndex === null}
            className="w-full items-center justify-center py-4 rounded-2xl"
            style={{
              backgroundColor: selectedIndex !== null ? "#7C3AED" : "#E5E7EB",
              borderWidth: 2,
              borderColor: selectedIndex !== null ? "#000" : "#D1D5DB",
              shadowColor: "#000",
              shadowOffset: {
                width: selectedIndex !== null ? 4 : 0,
                height: selectedIndex !== null ? 4 : 0,
              },
              shadowOpacity: selectedIndex !== null ? 1 : 0,
              shadowRadius: 0,
              elevation: selectedIndex !== null ? 4 : 0,
              opacity: selectedIndex !== null ? 1 : 0.6,
            }}
          >
            <Text
              className="text-lg"
              style={{
                fontWeight: "800",
                color: selectedIndex !== null ? "#FFF" : "#9CA3AF",
              }}
            >
              Continue
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
