import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import * as Day from "../src/components/Day";
import * as Activity from "../src/components/Activity";

import Octicons from "@expo/vector-icons/Octicons";

import colors from "tailwindcss/colors";
import { Header } from "../src/components/Header";
import { BottomTabNavigation } from "../routes/bottom-tab-navigator";

export function Home({ navigation }: BottomTabNavigation) {
  return (
    <ScrollView
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("all-activities")}
              >
                <Text className="text-sky-500 text-lg font-sans-semibold text-center mt-3">
                  Ver todas as atividades
                </Text>
              </TouchableOpacity>
            </View>
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
