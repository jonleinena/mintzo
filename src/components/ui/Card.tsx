import { Pressable, View } from "react-native";
import clsx from "clsx";
import type { ReactNode } from "react";

type CardColor = "white" | "cream" | "mint" | "indigo";

interface CardProps {
  children: ReactNode;
  className?: string;
  color?: CardColor;
  onPress?: () => void;
}

const colorClasses: Record<CardColor, string> = {
  white: "bg-surface-primary",
  cream: "bg-surface-cream",
  mint: "bg-surface-mint",
  indigo: "bg-surface-indigo",
};

const baseClasses =
  "rounded-md border-2 border-black shadow-[0px_4px_0px_0px_#000] p-4";

export function Card({
  children,
  className,
  color = "white",
  onPress,
}: CardProps) {
  const classes = clsx(baseClasses, colorClasses[color], className);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={classes}
        style={({ pressed }) =>
          pressed
            ? { transform: [{ translateY: 4 }], shadowColor: "transparent" }
            : undefined
        }
      >
        {children}
      </Pressable>
    );
  }

  return <View className={classes}>{children}</View>;
}
