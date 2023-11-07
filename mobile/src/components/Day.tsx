import { View, Text } from "react-native";

interface DayProps {
  children: React.ReactNode;
}

export function Root({ children }: DayProps) {
  return (
    <View>
      {children}
      <View className="h-px border border-zinc-600 mt-1" />
    </View>
  );
}

export function Date({ children }: DayProps) {
  return <Text className="text-zinc-400 text-lg font-sans-semibold">{children}</Text>;
}

export function Content({ children }: DayProps) {
  return <Text className="text-zinc-50 text-2xl font-sans-bold">{children}</Text>;
}
