import { BottomTabBarProps, RootBottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import { TabNavigationState } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ActivityData } from "../services/tasks";

export type BottomTabParamList = {
  home: undefined;
  "all-activities": undefined;
  "full-activity": ActivityData;
  "create-activity": undefined;
  "edit-activity": ActivityData;
  account: undefined;
};

export type BottomTabScreenNames = keyof BottomTabParamList;

export interface RootBottomTabBarProps extends BottomTabBarProps {
  state: TabNavigationState<RootBottomTabParamList>;
}

export type RootBottomTabBarNavigatorProps = TabNavigationState<RootBottomTabParamList>;

export type RootBottomTabNavigation<ScreenName> = BottomTabScreenProps<
  RootBottomTabParamList,
  ScreenName
>;
