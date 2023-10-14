import React from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";
import { ActivityData } from "../services/tasks";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";
import dayjs from "dayjs";

export function FullActivity({
  route: { params: activity },
  navigation: { goBack, jumpTo, reset },
}: RootBottomTabNavigation<"full-activity">) {
  const {
    title,
    subject,
    description,
    participants,
    id,
    points,
    deliveryDate,
  }: Readonly<ActivityData> = activity;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="pt-3 px-3 space-y-2">
        <View className="px-2 flex-row items-center justify-between mb-2">
          <View className="flex-row space-x-5 items-center">
            <TouchableOpacity activeOpacity={0.7} onPress={goBack} className="p-4 pl-0">
              <Octicons name="chevron-left" color={colors.zinc[50]} size={32} />
            </TouchableOpacity>
            <Text className="text-center text-zinc-50 text-2xl font-sans-bold">Atividade</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => jumpTo("edit-activity", activity)}
            className="flex-row space-x-2 items-center"
          >
            <Text className="text-sky-500 font-sans-semibold text-lg">Editar</Text>
            <Octicons name="pencil" color={colors.sky[500]} size={20} />
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
