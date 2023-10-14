import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Account } from "../screens/Account";

import { Footer } from "../src/components/Footer";
import { AllActivities } from "../screens/AllActivities";
import { CreateActivity } from "../screens/CreateActivity";
import { Home } from "../screens/Home";
import { RootBottomTabParamList } from "./bottom-tab-navigator";
import { ActivitiesContextProvider } from "../context/activities";

const { Navigator, Screen } = createBottomTabNavigator<RootBottomTabParamList>();

export function AppRoutes() {
  return (
    <ActivitiesContextProvider>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}
        sceneContainerStyle={{ backgroundColor: "transparent" }}
        tabBar={props => <Footer {...props} />}
      >
        <Screen name="home" component={Home} />
        <Screen name="create-activity" component={CreateActivity} />
        <Screen name="all-activities" component={AllActivities} />
        <Screen name="account" component={Account} />
      </Navigator>
    </ActivitiesContextProvider>
  );
}
