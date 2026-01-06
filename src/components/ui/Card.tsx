import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated';
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-lg p-md';

  const variantStyles = {
    default: 'bg-surface',
    elevated: 'bg-surface shadow-lg',
  };

  return (
    <View
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
