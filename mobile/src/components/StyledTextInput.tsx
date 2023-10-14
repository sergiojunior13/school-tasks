import { useRef } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";
import colors from "tailwindcss/colors";

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
  ...rest
}: StyledTextInputProps) {
  const inputRef = useRef(null);

  const borderColor = rest["data-isinvalid"] ? colors.red[600] : colors.sky[500];

  if (label)
    return (
      <View className={viewClassName}>
        <Text className={"text-zinc-50 text-xl font-sans-bold " + labelClassName}>{label}</Text>

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
      </View>
    );

  return (
    <TextInput
      {...rest}
      cursorColor={colors.sky[500]}
      className="bg-zinc-700 text-zinc-50 rounded-lg p-2 font-sans focus:border-2"
      style={{
        borderColor,
        borderWidth: rest["data-isinvalid"] ? 2 : 0,
      }}
      placeholderTextColor={colors.zinc[400]}
      ref={inputRef}
      onLayout={() => autoFocus && inputRef.current.focus()}
    />
  );
}
