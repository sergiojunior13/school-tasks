import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Account } from "../screens/Account";

import { Footer } from "../src/components/Footer";
import { AllActivities } from "../screens/AllActivities";
import { CreateActivity } from "../screens/CreateActivity";
import { FullActivity } from "../screens/FullActivity";
import { Home } from "../screens/Home";

import { BottomTabParamList } from "./bottom-tab-navigator";
import { ActivitiesContextProvider } from "../context/activities";
import { EditActivity } from "../screens/EditActivity";

const { Navigator, Screen } = createBottomTabNavigator<BottomTabParamList>();

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
        <Screen name="edit-activity" component={EditActivity} options={{ unmountOnBlur: true }} />
        <Screen name="full-activity" component={FullActivity} />
        <Screen name="all-activities" component={AllActivities} />
        <Screen name="account" component={Account} />
      </Navigator>
    </ActivitiesContextProvider>
  );
}
