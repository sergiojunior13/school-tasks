import { TouchableOpacity, TouchableOpacityProps, View, Text } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

interface ActivityProps {
  children: React.ReactNode;
}

export function Root({ children }: ActivityProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} className="p-3 bg-zinc-700 rounded-xl mt-3 space-y-4">
      {children}
    </TouchableOpacity>
  );
}

export function Header({ children }: ActivityProps) {
  return <View className="flex-row justify-between items-center">{children}</View>;
}

export function Subject({ children }: ActivityProps) {
  return (
    <Text className="px-3 py-1 font-sans bg-emerald-600 rounded-full justify-center items-center text-zinc-50 capitalize">
      {children}
    </Text>
  );
}

export function ButtonGroup({ children }: ActivityProps) {
  return <View className="flex-row space-x-4">{children}</View>;
}

export function Button({ children, className, ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={"items-center justify-center w-9 h-9 rounded-full " + className}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

export function Content({ children }: ActivityProps) {
  return <View className="space-y-1">{children}</View>;
}

export function ContentTitle({ children }: ActivityProps) {
  return (
    <Text numberOfLines={2} className="text-zinc-50 text-lg font-sans-bold">
      {children}
    </Text>
  );
}

export function Footer({ children }: ActivityProps) {
  return <View className="justify-between items-center flex-row">{children}</View>;
}

export function Participants({ children }: ActivityProps) {
  return (
    <View className="flex-row space-x-2 max-w-[90%]">
      <Octicons name="people" color={colors.zinc[400]} size={20} />
      <Text className="text-zinc-400 font-sans" numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

export function Points({ children }: ActivityProps) {
  return <Text className="text-zinc-400 font-sans">{children}</Text>;
}
