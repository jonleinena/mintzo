import { View, Text } from "react-native";

type ExamCountdownProps = {
  examDate: string | Date | null;
  label?: string;
};

function getDaysUntil(dateValue: string | Date | null) {
  if (!dateValue) return null;
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  const diffMs = date.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}

export function ExamCountdown({
  examDate,
  label = "Exam countdown",
}: ExamCountdownProps) {
  const days = getDaysUntil(examDate);

  return (
    <View
      className="bg-surface-cream border-2 border-black rounded-lg p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        height: 124,
      }}
    >
      <Text className="text-sm text-slate-500 font-medium">{label}</Text>
      {days === null ? (
        <>
          <Text className="text-2xl font-black mt-1">Set a date</Text>
          <Text className="text-xs text-slate-500">Plan your exam goal</Text>
        </>
      ) : (
        <>
          <Text className="text-4xl font-black mt-1">{days}</Text>
          <Text className="text-sm text-slate-500">days to go</Text>
        </>
      )}
    </View>
  );
}
