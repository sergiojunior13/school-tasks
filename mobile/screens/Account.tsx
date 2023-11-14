import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "../context/auth";

import { LoadingButton } from "../src/components/LoadingButton";
import { Icon } from "../src/components/Icon";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";

export function Account({ navigation: { navigate } }: RootBottomTabNavigation<"account">) {
  const {
    signOut,
    user: { email },
    isLoggingOut,
  } = useContext(AuthContext);

  return (
    <View className="px-6 pt-8 space-y-10">
      <Text className="text-center text-zinc-50 text-2xl font-sans-bold">Sua Conta</Text>

      <View>
        <Text className="text-zinc-50 text-xl font-sans-bold">Email</Text>
        <Text className="text-zinc-400 text-lg font-sans">{email}</Text>
      </View>

      <TouchableOpacity
        className="flex-row justify-between items-center"
        onPress={() => navigate("notifications")}
      >
        <Text className="text-zinc-50 text-xl font-sans-bold">Notificações</Text>
        <Icon name="chevron-right" />
      </TouchableOpacity>

      <LoadingButton
        onPress={signOut}
        className="bg-red-600 py-3 rounded-lg justify-center"
        isLoading={isLoggingOut}
      >
        <Text className="text-center text-zinc-50 font-sans-bold text-lg">Sair</Text>
      </LoadingButton>
    </View>
  );
}
