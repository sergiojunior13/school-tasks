import { View, TouchableOpacity, Text, ScrollView } from "react-native";

import * as Day from "../src/components/Day";
import * as Activity from "../src/components/Activity";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

export function AllActivities() {
  return (
    <ScrollView
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 96 }}
    >
      <View className="pt-8 px-3 space-y-10">
        <Text className="text-center text-zinc-50 text-2xl font-sans-bold">
          Todas as atividades
        </Text>
        <View className="p-3 bg-zinc-800 rounded-xl space-y-10">
          <View>
            <Day.Root>
              <Day.AlertContainer>
                <Day.Content>07/10</Day.Content>
                <Day.Alert>• Atrasado</Day.Alert>
              </Day.AlertContainer>
            </Day.Root>

            <DefaultActivity />
            <DefaultActivity />
          </View>

          <View>
            <Day.Root>
              <Day.Date>08/10</Day.Date>
              <Day.Content>Hoje</Day.Content>
            </Day.Root>
            <DefaultActivity />
            <DefaultActivity />
          </View>

          <View>
            <Day.Root>
              <Day.Date>09/10</Day.Date>
              <Day.Content>Amanhã</Day.Content>
            </Day.Root>
            <DefaultActivity />
            <DefaultActivity />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function DefaultActivity() {
  return (
    <Activity.Root>
      <Activity.Header>
        <Activity.Subject>Biologia</Activity.Subject>

        <Activity.ButtonGroup>
          <Activity.Button className="bg-green-500">
            <Octicons name="check" size={22} color={colors.zinc[50]} />
          </Activity.Button>
          <Activity.Button className="bg-red-500">
            <Octicons name="trash" size={22} color={colors.zinc[50]} />
          </Activity.Button>
        </Activity.ButtonGroup>
      </Activity.Header>

      <Activity.Content>
        <Activity.ContentTitle>Olá Mundo</Activity.ContentTitle>
      </Activity.Content>

      <Activity.Footer>
        <Activity.Participants>Sérgio, Mari</Activity.Participants>

        <Activity.Points>7,0pts</Activity.Points>
      </Activity.Footer>
    </Activity.Root>
  );
}
