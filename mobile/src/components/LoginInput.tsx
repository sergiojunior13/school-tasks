import { ControllerRenderProps, FieldErrors } from "react-hook-form";
import { View, Text } from "react-native";

import { StyledTextInput } from "./StyledTextInput";

import { FormData } from "../../screens/LogIn";

interface LoginInputProps
  extends ControllerRenderProps<FormData, "email" | "password"> {
  errors: FieldErrors<FormData>;
}

export function LoginInput({
  onBlur,
  onChange,
  value,
  name,
  errors,
}: LoginInputProps) {
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
        data-isinvalid={!!errors[name]}
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
