import { Image } from "expo-image";
import { View } from "react-native";
import logo from "../../assets/logo.png";

export function Header() {
  return (
    <View className="mt-12 items-center">
      <Image source={logo} contentFit="cover" className="w-60 h-10" />
    </View>
  );
}
