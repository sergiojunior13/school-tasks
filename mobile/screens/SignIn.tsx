import { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";

import { AuthContext } from "../context/auth";

import logo from "../assets/logo.png";

import { LoginInput } from "../src/components/LoginInput";
import { FormData } from "./LogIn";

import { useForm, Controller } from "react-hook-form";

import { StackScreenProps } from "../routes/stack-navigator";
import { LoadingButton } from "../src/components/LoadingButton";

export function SignIn({ navigation }: StackScreenProps) {
  const { signIn } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    await signIn(data).catch(errorMessage => setError("email", { message: errorMessage }));
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="px-4 pt-[40%] items-center">
        <Image source={logo} className="w-60 h-10" />
        <View className="mt-10 space-y-8">
          <Text className="text-zinc-50 text-base font-sans-semibold text-center">
            Gerencie suas atividades escolares, receba notificações e muito mais...
          </Text>
          <View>
            <Controller
              control={control}
              render={({ field }) => <LoginInput {...field} ref={null} errors={errors} />}
              name="email"
              rules={{
                required: "Email é obrigatório",
                pattern: {
                  message: "Email inválido",
                  value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
                },
              }}
            />
            <Controller
              control={control}
              render={({ field }) => <LoginInput {...field} ref={null} errors={errors} />}
              name="password"
              rules={{
                required: "Senha é obrigatória",
                minLength: {
                  message: "A senha deve conter pelo menos 8 caracteres",
                  value: 8,
                },
                maxLength: {
                  message: "A senha deve ser menor que 20 caracteres",
                  value: 20,
                },
              }}
            />
          </View>
          <LoadingButton
            activeOpacity={0.7}
            className="bg-green-500 py-4 rounded-lg justify-center"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            <Text className="text-center text-zinc-50 font-sans-bold text-xl">Criar Conta</Text>
          </LoadingButton>
          <View className="flex-row items-center m-auto">
            <Text className="text-zinc-50 font-sans text-base align-middle">
              Já possui uma conta?{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.replace("log-in")}>
              <Text className="text-sky-500 font-sans-bold text-base">Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
