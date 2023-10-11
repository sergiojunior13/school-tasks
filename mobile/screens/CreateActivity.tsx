import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from "react-native";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

import { StyledTextInput } from "../src/components/StyledTextInput";
import { RootBottomTabBarProps } from "../routes/bottom-tab-navigator";

export function CreateActivity({ navigation }: RootBottomTabBarProps) {
  return (
    <ScrollView
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="pt-3 px-3 space-y-10">
        <View className="px-2 flex-row space-x-5 items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigation.goBack}
            className="p-4 pl-0"
          >
            <Octicons name="chevron-left" color={colors.zinc[50]} size={32} />
          </TouchableOpacity>
          <Text className="text-center text-zinc-50 text-2xl font-sans-bold">
            Criar Atividade
          </Text>
        </View>

        <View className="space-y-8">
          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">Nome</Text>
            <StyledTextInput placeholder="Digite o nome da atividade..." />
          </View>
          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">Matéria</Text>
            <StyledTextInput placeholder="Digite a matéria da atividade..." />
          </View>
          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">
              Descrição
            </Text>
            <StyledTextInput
              placeholder="Digite a descrição da atividade..."
              multiline
            />
          </View>

          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">Valor</Text>
            <View className="flex-row items-center">
              <TextInput
                className="text-zinc-50 font-sans text-lg border-b border-zinc-400 text-center px-2"
                keyboardType="number-pad"
                defaultValue="0"
              />
              <Text className="text-zinc-400 font-sans text-lg"> pontos</Text>
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">
              Participantes
            </Text>
            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                className="p-2 px-3 bg-sky-500 rounded-full justify-center items-center flex-row space-x-2"
                activeOpacity={0.7}
              >
                <Text className="text-zinc-50 font-sans">Sérgio</Text>

                <Octicons name="x" size={20} color={colors.red[600]} />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2 px-3 bg-sky-500 rounded-full justify-center items-center flex-row space-x-2"
                activeOpacity={0.7}
              >
                <Octicons name="plus" size={20} color={colors.zinc[50]} />
                <Text className="text-zinc-50 font-sans">
                  Add. Participante
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-green-600 rounded-xl justify-center items-center py-3"
          >
            <Text className="text-zinc-50 font-sans-semibold text-xl">
              Criar Atividade
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
