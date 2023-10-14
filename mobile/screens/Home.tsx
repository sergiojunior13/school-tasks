import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Header } from "../src/components/Header";
import * as Day from "../src/components/Day";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";

import { ActivitiesContext } from "../context/activities";

import dayjs from "dayjs";
import { MountedActivity } from "../src/components/MountedActivity";

function sortDatesByDate(dates: string[]) {
  return dates.sort((date1, date2) => {
    const dateA = dayjs(date1);
    const dateB = dayjs(date2);

    if (dateA.isBefore(dateB)) {
      return -1;
    } else if (dateA.isAfter(dateB)) {
      return 1;
    } else {
      return 0;
    }
  });
}

function formatDate(date: string) {
  const differenceOfDays = dayjs().set("h", 0).set("m", 0).set("s", 0).diff(date, "d");

  switch (differenceOfDays) {
    case -1:
      return "Amanhã";
    case 0:
      return "Hoje";
    case 1:
      return "Ontem";
    default:
      return dayjs(date).format("DD/MM");
  }
}

export function Home({ navigation }: RootBottomTabNavigation) {
  const { activities } = useContext(ActivitiesContext);

  const activitiesDate = activities.map(activity => activity.deliveryDate);
  const todayAndTomorrowActivitiesDate = activitiesDate.filter(activityDate => {
    const differenceOfDays = dayjs().diff(activityDate, "d");

    if (differenceOfDays === 0 || differenceOfDays === -1) {
      return true;
    }
  });
  const activitiesDateSortedByDate = sortDatesByDate(todayAndTomorrowActivitiesDate);
  const noRepeatedTodayAndTomorrowActivitiesDate = [...new Set(activitiesDateSortedByDate)];

  const activitiesWithDateJSX = noRepeatedTodayAndTomorrowActivitiesDate.map((date, index) => (
    <View key={date + index}>
      <Day.Root>
        <Day.Date>{dayjs(date).format("DD/MM")}</Day.Date>
        <Day.Content>{formatDate(date)}</Day.Content>
      </Day.Root>
      {activities
        .filter(activity => activity.deliveryDate == date)
        .map(({ title, subject, participants, points, id }) => (
          <MountedActivity
            title={title}
            participants={participants}
            points={points}
            subject={subject}
            key={title + index}
            id={id}
          />
        ))}
    </View>
  ));

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
          <View className="p-3 bg-zinc-800 rounded-xl space-y-10">
            {activities.length > 0 ? (
              activitiesWithDateJSX
            ) : (
              <Text className="text-zinc-400 font-sans-semibold text-base text-center">
                Você ainda não tem nenhuma atividade registrada.
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (activities.length > 0) {
                  navigation.navigate("all-activities");
                } else {
                  navigation.navigate("create-activity");
                }
              }}
            >
              <Text className="text-sky-500 text-lg font-sans-semibold text-center mt-3">
                {activities.length > 0 ? "Ver todas as atividades" : "Criar Atividade"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
