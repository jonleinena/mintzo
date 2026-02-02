import { View, Text } from "react-native";
import { ProgressBar } from "@/components/ui/ProgressBar";

type PlanItem = {
  title: string;
  minutes: number;
  completed?: boolean;
};

type DailyPlanProps = {
  title?: string;
  totalMinutes: number;
  completedMinutes: number;
  items: PlanItem[];
};

export function DailyPlan({
  title = "Today's plan",
  totalMinutes,
  completedMinutes,
  items,
}: DailyPlanProps) {
  const progress = totalMinutes > 0 ? completedMinutes / totalMinutes : 0;

  return (
    <View
      className="bg-surface-secondary border-2 border-black rounded-lg p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-bold">{title}</Text>
        <Text className="text-xs text-slate-500">
          {completedMinutes} / {totalMinutes} min
        </Text>
      </View>

      <ProgressBar progress={progress} />

      <View className="mt-4 gap-2">
        {items.map((item, index) => (
          <View
            key={`${item.title}-${index}`}
            className="bg-white border-2 border-black rounded-md px-3 py-2 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <View
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{
                  backgroundColor: item.completed ? "#4ADE80" : "#E5E7EB",
                  borderWidth: 1.5,
                  borderColor: "#000",
                }}
              >
                <Text className="text-xs font-black">
                  {item.completed ? "✓" : ""}
                </Text>
              </View>
              <Text className="text-sm font-bold text-black">{item.title}</Text>
            </View>
            <Text className="text-xs text-slate-500">{item.minutes} min</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
