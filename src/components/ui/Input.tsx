import { Text, TextInput, View } from "react-native";
import clsx from "clsx";
import type { KeyboardTypeOptions } from "react-native";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  autoCapitalize,
  keyboardType,
}: InputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-bold text-black mb-1">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        className={clsx(
          "border-2 border-black rounded-md px-4 py-3 text-base bg-surface-primary",
          error && "border-red-500",
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}
