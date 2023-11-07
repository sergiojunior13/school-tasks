import { ScrollView, Text, View } from "react-native";

import { Header } from "../src/components/Header";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";

import { ListOfActivities } from "../src/components/ListOfActivities";

import { calculateDiffOfDateAndTodayInDays } from "../utils/date";

function filterTodayAndTomorrowActivities(activityDate: string) {
  const differenceOfDays = calculateDiffOfDateAndTodayInDays(activityDate);

  return differenceOfDays === 0 || differenceOfDays === 1;
}

export function Home({ navigation }: RootBottomTabNavigation<"home">) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 96 }}
    >
      <Header />

      <View className="px-3 mt-10 space-y-16">
        <View className="space-y-2">
          <Text className="font-sans-bold text-zinc-50 text-xl">
            Suas atividades para hoje/amanhã
          </Text>

          <ListOfActivities
            navigation={navigation}
            filterActivitiesFunction={filterTodayAndTomorrowActivities}
            showAllActivitiesButton
            customNoActivitiesText=" Você ainda não tem nenhuma atividade registrada para hoje/amanhã."
          />
        </View>
      </View>
    </ScrollView>
  );
}
