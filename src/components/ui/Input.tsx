import { TextInput, TextInputProps, View, Text } from 'react-native';
import { forwardRef } from 'react';
import { colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <View className={className}>
        {label && (
          <Text className="text-text-secondary mb-xs">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`p-md bg-surface rounded-lg text-text-primary ${
            error ? 'border border-error' : ''
          }`}
          placeholderTextColor={colors.text.muted}
          {...props}
        />
        {error && (
          <Text className="text-error text-sm mt-xs">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
