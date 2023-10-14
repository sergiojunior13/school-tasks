import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignIn } from "../screens/SignIn";
import { LogIn } from "../screens/LogIn";
import { StackParamList } from "./stack-navigator";

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Screen name="sign-in" component={SignIn} />
      <Screen name="log-in" component={LogIn} />
    </Navigator>
  );
}
