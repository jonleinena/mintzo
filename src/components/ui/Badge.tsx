import { Text, View } from "react-native";
import clsx from "clsx";

type BadgeColor = "brand" | "success" | "gold";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
}

const colorClasses: Record<BadgeColor, string> = {
  brand: "bg-brand-violet",
  success: "bg-accent-success",
  gold: "bg-accent-gold",
};

const textColorClasses: Record<BadgeColor, string> = {
  brand: "text-white",
  success: "text-black",
  gold: "text-black",
};

export function Badge({ label, color = "brand", size = "md" }: BadgeProps) {
  return (
    <View
      className={clsx(
        "border-2 border-black rounded-sm self-start",
        colorClasses[color],
        size === "sm" ? "px-2 py-0.5" : "px-3 py-1",
      )}
    >
      <Text
        className={clsx(
          "font-bold",
          textColorClasses[color],
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {label}
      </Text>
    </View>
  );
}
