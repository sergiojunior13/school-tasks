import { useContext, useState } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

import { RootBottomTabNavigation } from "../../routes/bottom-tab-navigator";
import { ActivitiesContext } from "../../context/activities";
import { MountedActivity } from "./MountedActivity";

import * as Day from "../components/Day";
import * as Modal from "./Modal";

import { ActivityData } from "../../services/tasks";

import { formatDate, sortDatesByDate } from "../../utils/date";

import dayjs from "dayjs";
import colors from "tailwindcss/colors";
import { LoadingButton } from "./LoadingButton";

interface ListOfActivities {
  navigation: RootBottomTabNavigation<any>["navigation"];
  showAllActivitiesButton?: boolean;
  filterActivitiesFunction?: (value: string, index?: number, array?: string[]) => boolean;
  customNoActivitiesText?: string;
}

export function ListOfActivities({
  navigation,
  showAllActivitiesButton = false,
  filterActivitiesFunction,
  customNoActivitiesText = "Você ainda não tem nenhuma atividade registrada.",
}: ListOfActivities) {
  const [activityToRemoveId, setActivityToRemoveId] = useState<number>();
  const [activityToFinalize, setActivityToFinalize] = useState<ActivityData>();

  function openDeleteActivityModal(activityId: number) {
    setActivityToRemoveId(activityId);
  }

  function openFinalizeActivityModal(activity: ActivityData) {
    setActivityToFinalize(activity);
  }

  const { removeActivity, finalizeActivity } = useContext(ActivitiesContext);

  const { activities, isActivitiesLoading } = useContext(ActivitiesContext);

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

        <Day.Content>{formatDate(date)}</Day.Content>
      </Day.Root>
      {activities
        .filter(activity => activity.deliveryDate == date)
        .map(activity => (
          <MountedActivity
            activity={activity}
            openRemoveActivityModal={openDeleteActivityModal}
            openFinalizeActivityModal={openFinalizeActivityModal}
            key={activity.title + activity.id}
          />
        ))}
    </View>
  ));

  if (isActivitiesLoading) {
    return (
      <View className="p-3 bg-zinc-800 rounded-xl space-y-10">
        <ActivityIndicator size={28} color={colors.zinc[400]} />
      </View>
    );
  }

  return (
    <View className="p-3 bg-zinc-800 rounded-xl space-y-10">
      {filteredActivities.length > 0 ? (
        activitiesWithDateJSX
      ) : (
        <Text className="text-zinc-400 font-sans-semibold text-base text-center">
          {customNoActivitiesText}
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

      <MountedRemoveActivityModal
        setActivityToRemoveId={setActivityToRemoveId}
        activityToRemoveId={activityToRemoveId}
        removeActivity={removeActivity}
      />

      <MountedFinalizeActivityModal
        setActivityToFinalize={setActivityToFinalize}
        activityToFinalize={activityToFinalize}
        finalizeActivity={finalizeActivity}
      />
    </View>
  );
}

interface MountedRemoveActivityModalProps {
  setActivityToRemoveId: React.Dispatch<React.SetStateAction<number>>;
  activityToRemoveId: number;
  removeActivity: (id: number) => Promise<void>;
}

function MountedRemoveActivityModal({
  activityToRemoveId,
  removeActivity,
  setActivityToRemoveId,
}: MountedRemoveActivityModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteActivity() {
    setIsDeleting(true);

    await removeActivity(activityToRemoveId);

    setIsDeleting(false);
    setActivityToRemoveId(null);
  }

  return (
    <Modal.Root visible={activityToRemoveId != null}>
      <Modal.Content>
        <Modal.ContentText className="text-center font-sans-semibold text-lg">
          Você tem certeza que deseja excluir essa atividade?
        </Modal.ContentText>
      </Modal.Content>

      <View className="space-y-3 mt-5">
        <Modal.Button
          onPress={() => setActivityToRemoveId(null)}
          className="bg-green-600 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Cancelar</Text>
        </Modal.Button>
        <LoadingButton
          onPress={handleDeleteActivity}
          isLoading={isDeleting}
          className="bg-red-600 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Excluir</Text>
        </LoadingButton>
      </View>
    </Modal.Root>
  );
}

interface MountedFinalizeActivityModalProps {
  finalizeActivity: (activityData: ActivityData) => Promise<void>;
  setActivityToFinalize: React.Dispatch<React.SetStateAction<ActivityData>>;
  activityToFinalize: ActivityData;
}

function MountedFinalizeActivityModal({
  activityToFinalize,
  setActivityToFinalize,
  finalizeActivity,
}: MountedFinalizeActivityModalProps) {
  const [isFinalizing, setIsFinalizing] = useState(false);

  async function handleFinalizeActivity() {
    setIsFinalizing(true);

    await finalizeActivity(activityToFinalize);

    setIsFinalizing(false);
    setActivityToFinalize(null);
  }

  return (
    <Modal.Root visible={activityToFinalize != null}>
      <Modal.Content>
        <Modal.ContentText className="text-center font-sans-semibold text-lg">
          Você tem certeza que deseja finalizar essa atividade?
        </Modal.ContentText>
      </Modal.Content>

      <View className="space-y-3 mt-5">
        <Modal.Button
          onPress={() => setActivityToFinalize(null)}
          className="bg-zinc-600 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Cancelar</Text>
        </Modal.Button>
        <LoadingButton
          onPress={handleFinalizeActivity}
          isLoading={isFinalizing}
          className="bg-green-500 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Finalizar</Text>
        </LoadingButton>
      </View>
    </Modal.Root>
  );
}
