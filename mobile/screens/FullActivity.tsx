import React, { useContext, useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";
import { ActivityData } from "../services/tasks";

import { Icon } from "../src/components/Icon";
import colors from "tailwindcss/colors";
import dayjs from "dayjs";
import { ActivitiesContext } from "../context/activities";
import { LoadingButton } from "../src/components/LoadingButton";

export function FullActivity({
  route: { params: activity },
  navigation: { goBack, jumpTo },
}: RootBottomTabNavigation<"full-activity">) {
  const {
    title,
    subject,
    description,
    participants,
    id,
    points,
    deliveryDate,
    status,
  }: Readonly<ActivityData> = activity;

  const { removeActivity, finalizeActivity } = useContext(ActivitiesContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  async function handlePressDeleteButton() {
    setIsDeleting(true);

    await removeActivity(id);

    setIsDeleting(false);
    goBack();
  }
  async function handlePressFinalizeButton() {
    setIsFinalizing(true);

    await finalizeActivity(activity);

    setIsFinalizing(false);
    goBack();
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="pt-3 px-3">
        <View className="px-2 flex-row items-center justify-between mb-2">
          <View className="flex-row space-x-5 items-center">
            <TouchableOpacity activeOpacity={0.7} onPress={goBack} className="p-4 pl-0">
              <Icon name="chevron-left" size={32} />
            </TouchableOpacity>
            <Text className="text-center text-zinc-50 text-2xl font-sans-bold">Atividade</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => jumpTo("edit-activity", activity)}
            className="flex-row space-x-2 items-center"
          >
            <Text className="text-sky-500 font-sans-semibold text-lg">Editar</Text>
            <Icon name="pencil" color={colors.sky[500]} size={20} />
          </TouchableOpacity>
        </View>

        <View>
          <ActivityItem label="Nome">{title}</ActivityItem>
          <ActivityItem label="Matéria">{subject}</ActivityItem>
          <ActivityItem label="Data de entrega">
            {dayjs(deliveryDate).format("DD/MM/YY")}
          </ActivityItem>
          <ActivityItem label="Descrição">{description}</ActivityItem>
          {participants.length > 0 && participants[0] && (
            <ActivityItem label="Participantes">{participants.join(", ")}</ActivityItem>
          )}
          {points > 0 && <ActivityItem label="Valor">{points} pontos</ActivityItem>}
        </View>

        <LoadingButton
          onPress={handlePressDeleteButton}
          className="flex-row space-x-3 items-center justify-center rounded-lg bg-red-600 py-4 mt-16"
          isLoading={isDeleting}
        >
          <Icon name="trash" size={24} />
          <Text className="text-xl font-sans-bold text-zinc-50">Excluir</Text>
        </LoadingButton>

        {status === "pending" && (
          <LoadingButton
            onPress={handlePressFinalizeButton}
            className="flex-row space-x-3 items-center justify-center rounded-lg bg-green-600 py-4 mt-4"
            isLoading={isFinalizing}
          >
            <Icon name="check" size={24} />
            <Text className="text-xl font-sans-bold text-zinc-50">Finalizar</Text>
          </LoadingButton>
        )}
      </View>
    </ScrollView>
  );
}

interface ActivityItemProps {
  children: React.ReactNode;
  label: string;
}

function ActivityItem({ children, label }: ActivityItemProps) {
  return (
    <View className="mt-8">
      <Text className="text-zinc-50 text-xl font-sans-bold">{label}</Text>
      <Text className="text-zinc-400 text-base font-sans">{children}</Text>
    </View>
  );
}
