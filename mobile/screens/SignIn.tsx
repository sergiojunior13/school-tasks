import { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";

import { AuthContext } from "../context/auth";

import logo from "../assets/logo.png";

import { StyledTextInput } from "../src/components/StyledTextInput";

import {
  useForm,
  Controller,
  ControllerRenderProps,
  FieldErrors,
} from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

export function SignIn() {
  const { signIn } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormData>();

  function onSubmit(data: FormData) {
    signIn(data);
  }

  return (
    <ScrollView
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="px-4 pt-[40%] items-center">
        <Image source={logo} className="w-60 h-10" />
        <View className="mt-10 space-y-8">
          <Text className="text-zinc-50 text-base font-sans-semibold text-center">
            Gerencie suas atividades escolares, receba notificações e muito
            mais...
          </Text>
          <View>
            <Controller
              control={control}
              render={({ field }) => (
                <LoginInput {...field} ref={null} errors={errors} />
              )}
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
              render={({ field }) => (
                <LoginInput {...field} ref={null} errors={errors} />
              )}
              name="password"
              rules={{
                required: "Senha é obrigatória",
                minLength: {
                  message: "A senha deve conter pelo menos 8 caracteres",
                  value: 8,
                },
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-green-500 py-4 rounded-lg"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-center text-zinc-50 font-sans-bold text-xl">
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

interface EmailInputProps
  extends ControllerRenderProps<FormData, "email" | "password"> {
  errors: FieldErrors<FormData>;
}

function LoginInput({
  onBlur,
  onChange,
  value,
  name,
  errors,
}: EmailInputProps) {
  enum labelName {
    email = "Email",
    password = "Senha",
  }

  enum placeholderText {
    email = "Digite seu email...",
    password = "Digite sua senha...",
  }

  enum keyboardType {
    email = "email-address",
    password = "visible-password",
  }

  return (
    <View className="space-y-2 mb-4">
      <Text className="text-zinc-50 text-xl font-sans-bold">
        {labelName[name]}
      </Text>
      <StyledTextInput
        data-isinvalid={errors[name] ? "true" : "false"}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        autoCapitalize="none"
        keyboardType={keyboardType[name]}
        placeholder={placeholderText[name]}
      />
      {errors[name] && (
        <Text className="text-red-500 font-sans">{errors[name].message}</Text>
      )}
    </View>
  );
}
