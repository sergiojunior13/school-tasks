import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

export function StyledTextInput(props: TextInputProps) {
  const borderColor =
    props["data-isinvalid"] == "true" ? colors.red[500] : colors.sky[500];

  return (
    <TextInput
      {...props}
      cursorColor={colors.sky[500]}
      className="bg-zinc-700 text-zinc-50 rounded-lg p-2 font-sans"
      style={{
        borderColor,
        borderWidth: props["data-isinvalid"] == "true" ? 2 : 0,
      }}
      placeholderTextColor={colors.zinc[400]}
    />
  );
}
