import { View, Text } from "react-native";
import { ACTIVITY_LEVELS } from "@/constants/gamificationConfig";

type ContributionEntry = {
  date: string;
  minutes: number;
};

type ContributionsGraphProps = {
  data?: ContributionEntry[];
  weeks?: number;
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  emptyLabel?: string;
};

const LEVEL_COLORS = [
  "#F3F4F6",
  "#FEF3C7",
  "#D1FAE5",
  "#E0E7FF",
  "#93C5FD",
] as const;

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

function normalizeDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function startOfWeekMonday(date: Date) {
  const day = (date.getDay() + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function resolveActivityLevel(minutes: number) {
  if (minutes <= ACTIVITY_LEVELS[0].max) return 0;
  if (minutes <= ACTIVITY_LEVELS[1].max) return 1;
  if (minutes <= ACTIVITY_LEVELS[2].max) return 2;
  if (minutes <= ACTIVITY_LEVELS[3].max) return 3;
  return 4;
}

export function ContributionsGraph({
  data = [],
  weeks = 16,
  title = "Practice Activity",
  subtitle = "Last 12 weeks",
  showLegend = true,
  emptyLabel = "Start practicing to fill in your activity graph",
}: ContributionsGraphProps) {
  const today = new Date();
  const currentWeekStart = startOfWeekMonday(today);
  const startDate = new Date(currentWeekStart);
  startDate.setDate(currentWeekStart.getDate() - (weeks - 1) * 7);

  const dataMap = new Map<string, number>();
  data.forEach((entry) => {
    const key = normalizeDateKey(entry.date);
    if (key) dataMap.set(key, entry.minutes);
  });

  return (
    <View
      className="bg-white border-2 border-black rounded-lg p-4"
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
        <Text className="text-xs text-slate-500 font-medium">{subtitle}</Text>
      </View>

      <View className="items-center">
        <View className="flex-row">
          <View className="mr-2 justify-between py-[2px]">
            {DAY_LABELS.map((label, index) => (
              <Text
                key={`${label}-${index}`}
                className="text-[10px] text-slate-400"
              >
                {label}
              </Text>
            ))}
          </View>
          <View className="flex-row gap-[3px]">
            {Array.from({ length: weeks }).map((_, weekIndex) => (
              <View key={weekIndex} className="gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const offset = weekIndex * 7 + dayIndex;
                  const cellDate = new Date(startDate);
                  cellDate.setDate(startDate.getDate() + offset);
                  const key = cellDate.toISOString().slice(0, 10);
                  const minutes = dataMap.get(key) ?? 0;
                  const level = resolveActivityLevel(minutes);
                  return (
                    <View
                      key={key}
                      className="w-[13px] h-[13px] rounded-[3px]"
                      style={{
                        backgroundColor: LEVEL_COLORS[level],
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.15)",
                      }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>

      {showLegend && (
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-xs text-slate-400">Less</Text>
          <View className="flex-row items-center gap-[3px]">
            {LEVEL_COLORS.map((color, index) => (
              <View
                key={`${color}-${index}`}
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </View>
          <Text className="text-xs text-slate-400">More</Text>
        </View>
      )}

      {data.length === 0 && (
        <Text className="text-xs text-slate-400 mt-3">{emptyLabel}</Text>
      )}
    </View>
  );
}
