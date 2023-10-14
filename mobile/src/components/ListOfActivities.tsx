import { useContext } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { RootBottomTabNavigation } from "../../routes/bottom-tab-navigator";
import { ActivitiesContext } from "../../context/activities";
import { MountedActivity } from "./MountedActivity";

import * as Day from "../components/Day";

import dayjs from "dayjs";

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
  const differenceOfDateAndTodayInDays = calculateDiffOfDateAndTodayInDays(date);

  switch (differenceOfDateAndTodayInDays) {
    case 1:
      return "Amanhã";
    case 0:
      return "Hoje";
    case -1:
      return "Ontem";
    default:
      return dayjs(date).format("DD/MM");
  }
}

export function calculateDiffOfDateAndTodayInDays(date: string) {
  const startOfTodayDate = dayjs().startOf("day");
  return dayjs(date).diff(startOfTodayDate, "day");
}

interface ListOfActivities {
  navigation: RootBottomTabNavigation<any>["navigation"];
  showAllActivitiesButton?: boolean;
  filterActivitiesFunction?: (value: string, index?: number, array?: string[]) => boolean;
}

export function ListOfActivities({
  navigation,
  showAllActivitiesButton = false,
  filterActivitiesFunction,
}: ListOfActivities) {
  const { activities } = useContext(ActivitiesContext);

  const activitiesDate = activities.map(activity => activity.deliveryDate);

  const filteredActivities = filterActivitiesFunction
    ? activitiesDate.filter(filterActivitiesFunction)
    : activitiesDate;

  const activitiesDateSortedByDate = sortDatesByDate(filteredActivities);
  const noRepeatedDates = [...new Set(activitiesDateSortedByDate)];

  const activitiesWithDateJSX = noRepeatedDates.map((date, index) => (
    <View key={date + index}>
      <Day.Root>
        <Day.Date>{dayjs(date).format("DD/MM/YY")}</Day.Date>
        <Day.AlertContainer>
          <Day.Content>{formatDate(date)}</Day.Content>
          {calculateDiffOfDateAndTodayInDays(date) < 0 && <Day.Alert>• Atrasado</Day.Alert>}
        </Day.AlertContainer>
      </Day.Root>
      {activities
        .filter(activity => activity.deliveryDate == date)
        .map(({ title, subject, participants, points, id, deliveryDate, description }) => (
          <MountedActivity
            title={title}
            participants={participants}
            deliveryDate={deliveryDate}
            description={description}
            points={points}
            subject={subject}
            key={title + index}
            id={id}
          />
        ))}
    </View>
  ));

  return (
    <View className="p-3 bg-zinc-800 rounded-xl space-y-10">
      {filteredActivities.length > 0 ? (
        activitiesWithDateJSX
      ) : (
        <Text className="text-zinc-400 font-sans-semibold text-base text-center">
          Você ainda não tem nenhuma atividade registrada.
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (filteredActivities.length > 0 && showAllActivitiesButton) {
            navigation.navigate("all-activities");
          } else {
            navigation.navigate("create-activity");
          }
        }}
      >
        <Text className="text-sky-500 text-lg font-sans-semibold text-center mt-3">
          {filteredActivities.length > 0 && showAllActivitiesButton
            ? "Ver todas as atividades"
            : "Criar Atividade"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
