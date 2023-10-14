import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type StackScreenNames = ["sign-in", "log-in"];
export type StackParamList = Record<StackScreenNames[number], undefined>;

export type StackScreenProps = NativeStackScreenProps<StackParamList>;
