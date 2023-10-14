import React from "react";
import { View, Text, ScrollView } from "react-native";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";
import { ListOfActivities } from "../src/components/ListOfActivities";

export function AllActivities({ navigation }: RootBottomTabNavigation<"all-activities">) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 96 }}
    >
      <View className="pt-8 px-3">
        <Text className="text-center text-zinc-50 text-2xl font-sans-bold mb-10">
          Todas as atividades
        </Text>

        <ListOfActivities navigation={navigation} />
      </View>
    </ScrollView>
  );
}
