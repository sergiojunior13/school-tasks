import { View, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";
import Octicons from "@expo/vector-icons/Octicons";
import {
  BottomTabScreenNames,
  RootBottomTabBarProps,
} from "../../routes/bottom-tab-navigator";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export function Footer({
  state,
  navigation,
}: RootBottomTabBarProps | BottomTabBarProps) {
  return (
    <View className="flex-row py-4 bg-zinc-950 justify-between items-center">
      {state.routes.map((route, index) => (
        <FooterTab
          index={index}
          name={route.name}
          state={state}
          navigation={navigation}
          key={route.key}
        />
      ))}
    </View>
  );
}

interface FooterTabProps {
  name: BottomTabScreenNames[number];
  state: RootBottomTabBarProps["state"] | BottomTabBarProps["state"];
  index: number;
  navigation:
    | RootBottomTabBarProps["navigation"]
    | BottomTabBarProps["navigation"];
}

function FooterTab({ name, state, index, navigation }: FooterTabProps) {
  enum routesToIconDictionary {
    home = "home",
    "create-activity" = "plus-circle",
    "all-activities" = "calendar",
    account = "person",
  }

  const isFocused = state.index === index;

  const tabColor = isFocused ? colors.sky[500] : colors.zinc[50];

  function handleOnPress() {
    navigation.navigate(name);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleOnPress}
      className="px-10"
    >
      <Octicons
        name={routesToIconDictionary[name]}
        color={tabColor}
        size={28}
      />
    </TouchableOpacity>
  );
}
