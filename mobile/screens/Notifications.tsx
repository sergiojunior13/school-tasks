import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";

import { LoadingButton } from "../src/components/LoadingButton";

import { getHoursToNotify, registerHoursToNotify } from "../utils/local-storage";
import { notify } from "../utils/notification";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";

import { ActivitiesContext } from "../context/activities";

import colors from "tailwindcss/colors";

export function Notifications({
  navigation: { goBack },
}: RootBottomTabNavigation<"notifications">) {
  const [hoursToNotify, setHoursToNotify] = useState([6, 12, 16, 18, 20]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getHoursToNotify().then(setHoursToNotify);
  }, []);

  function handleHourInputChange(newHour: number, index: number) {
    if (newHour > 24) newHour = 24;

    setHoursToNotify(prevHours => {
      const newHoursList = [...prevHours];
      newHoursList[index] = newHour;
      return newHoursList;
    });
  }

  async function handleSaveButtonPress() {
    setIsLoading(true);

    await registerHoursToNotify(hoursToNotify);

    const { activities } = useContext(ActivitiesContext);
    await notify(activities);

    setIsLoading(false);

    goBack();
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="px-6 pt-8 space-y-10">
        <Text className="text-center text-zinc-50 text-2xl font-sans-bold">Notificações</Text>

        <View>
          <Text className="text-zinc-50 text-xl font-sans-bold">Horas para notificar: </Text>
          <View className="flex-row mt-2">
            {hoursToNotify.map((hour, index) => (
              <HourInput
                key={index}
                hour={hour}
                index={index}
                handleHourInputChange={handleHourInputChange}
              />
            ))}
          </View>
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSaveButtonPress}
          className="bg-green-600 py-3 rounded-lg justify-center"
        >
          <Text className="text-zinc-50 font-sans-bold text-lg">Salvar</Text>
        </LoadingButton>
      </View>
    </ScrollView>
  );
}

function HourInput({
  hour,
  index,
  handleHourInputChange,
}: {
  hour: number;
  index: number;
  handleHourInputChange: Function;
}) {
  return (
    <TextInput
      className="w-12 h-12 bg-zinc-700 border border-zinc-600 rounded-lg text-center text-zinc-50 font-sans text-xl focus:border-sky-500 focus:border-2 mr-2"
      value={hour.toString()}
      keyboardType="number-pad"
      cursorColor={colors.sky[500]}
      onChangeText={newHour => handleHourInputChange(Number(newHour), index)}
    />
  );
}
