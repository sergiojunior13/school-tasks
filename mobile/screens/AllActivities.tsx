import React, { useContext } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";

import * as Day from "../src/components/Day";

import { ActivitiesContext } from "../context/activities";

import dayjs from "dayjs";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";
import { MountedActivity } from "../src/components/MountedActivity";

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

export function AllActivities({ navigation }: RootBottomTabNavigation) {
  const { activities } = useContext(ActivitiesContext);

  const activitiesDate = activities.map(activity => activity.deliveryDate);
  dayjs;
  const activitiesDateSortedByDate = sortDatesByDate(activitiesDate);
  const noRepeatedActivitiesDate = [...new Set(activitiesDateSortedByDate)];

  const activitiesWithDateJSX = noRepeatedActivitiesDate.map((date, index) => (
    <View key={date + index}>
      <Day.Root>
        <Day.Date>{dayjs(date).format("DD/MM")}</Day.Date>
        <Day.Content>{formatDate(date)}</Day.Content>
      </Day.Root>
      {activities
        .filter(task => task.deliveryDate == date)
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
      <View className="pt-8 px-3 space-y-10">
        <Text className="text-center text-zinc-50 text-2xl font-sans-bold">
          Todas as atividades
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
            onPress={() => navigation.navigate("create-activity")}
          >
            <Text className="text-sky-500 text-lg font-sans-semibold text-center mt-3">
              Criar Atividade
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
