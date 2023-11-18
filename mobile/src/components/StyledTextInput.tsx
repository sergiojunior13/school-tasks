import { useRef, useState } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";
import colors from "tailwindcss/colors";
import { Icon } from "./Icon";

interface StyledTextInputProps extends TextInputProps {
  label?: string;
  labelClassName?: string;
  viewClassName?: string;
}

export function StyledTextInput({
  label,
  labelClassName,
  viewClassName,
  autoFocus,
  secureTextEntry,
  ...rest
}: StyledTextInputProps) {
  const inputRef = useRef(null);
  const [isInputHidden, setIsInputHidden] = useState(true);

  const borderColor = rest["data-isinvalid"] ? colors.red[600] : colors.sky[500];

  const defaultInput = (
    <TextInput
      {...rest}
      ref={inputRef}
      onLayout={() => autoFocus && inputRef.current.focus()}
      cursorColor={colors.sky[500]}
      className="bg-zinc-700 text-zinc-50 rounded-lg p-2 font-sans focus:border-2"
      style={{
        borderColor,
        borderWidth: rest["data-isinvalid"] ? 2 : 0,
      }}
      placeholderTextColor={colors.zinc[400]}
    />
  );

  const passwordInput = (
    <View
      className="bg-zinc-700 rounded-lg p-2 pr-3 focus:border-2 flex-row justify-between items-center"
      style={{
        borderColor,
        borderWidth: rest["data-isinvalid"] ? 2 : 0,
      }}
    >
      <TextInput
        {...rest}
        style={null}
        ref={inputRef}
        secureTextEntry={isInputHidden}
        onLayout={() => autoFocus && inputRef.current.focus()}
        cursorColor={colors.sky[500]}
        className="text-zinc-50 font-sans w-[85%]"
        placeholderTextColor={colors.zinc[400]}
      />

      <Icon
        name={isInputHidden ? "eye-closed" : "eye"}
        color={colors.zinc[400]}
        size={24}
        onPress={() => setIsInputHidden(prevValue => !prevValue)}
      />
    </View>
  );

  const Input = secureTextEntry ? passwordInput : defaultInput;

  if (label)
    return (
      <View className={viewClassName}>
        <Text className={"text-zinc-50 text-xl font-sans-bold " + labelClassName}>{label}</Text>
        {Input}
      </View>
    );

  return Input;
}
