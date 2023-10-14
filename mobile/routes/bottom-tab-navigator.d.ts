import { BottomTabBarProps, RootBottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { TabNavigationState } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type BottomTabScreenNames = ["home", "all-activities", "create-activity", "account"];
export type RootBottomTabParamList = Record<BottomTabScreenNames[number], undefined>;

export interface RootBottomTabBarProps extends BottomTabBarProps {
  state: TabNavigationState<RootBottomTabParamList | null>;
}

export type RootBottomTabBarNavigatorProps = TabNavigationState<RootBottomTabParamList>;

export type RootBottomTabNavigation = BottomTabScreenProps<RootBottomTabParamList>;
