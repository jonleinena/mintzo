import { ActivityIndicator, Pressable, Text } from "react-native";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5",
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  size = "md",
  fullWidth = false,
  loading = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        "rounded-md items-center justify-center",
        sizeClasses[size],
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-brand-violet border-2 border-black shadow-[0px_4px_0px_0px_#000]",
        variant === "secondary" &&
          "bg-surface-primary border-2 border-black shadow-[0px_4px_0px_0px_#000]",
        variant === "ghost" && "bg-transparent",
        disabled && "opacity-50",
      )}
      style={({ pressed }) =>
        pressed && variant !== "ghost"
          ? { transform: [{ translateY: 4 }], shadowColor: "transparent" }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#000"}
          size="small"
        />
      ) : (
        <Text
          className={clsx(
            "font-bold",
            textSizeClasses[size],
            variant === "primary" && "text-white",
            variant === "secondary" && "text-black",
            variant === "ghost" && "text-brand-violet",
          )}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
