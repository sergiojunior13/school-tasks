import { ControllerRenderProps, FieldErrors } from "react-hook-form";
import { Text } from "react-native";

import { ActivityData } from "../../services/tasks";
import { StyledTextInput } from "./StyledTextInput";

interface ActivityFormTextInputProps
  extends ControllerRenderProps<ActivityData, "title" | "description" | "subject"> {
  errors: FieldErrors<ActivityData>;
}

export function ActivityFormTextInput({
  name,
  onBlur,
  onChange,
  value,
  errors,
}: ActivityFormTextInputProps) {
  enum placeholderText {
    title = "Digite o nome da atividade...",
    description = "Digite a descrição da atividade...",
    subject = "Digite a matéria da atividade...",
  }

  enum labelText {
    title = "Nome*",
    description = "Descrição",
    subject = "Matéria*",
  }

  return (
    <>
      <StyledTextInput
        data-isinvalid={!!errors[name]}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        placeholder={placeholderText[name]}
        multiline={name === "description"}
        label={labelText[name]}
        viewClassName="mt-8"
      />
      {errors[name] && <Text className="text-red-600 font-sans">{errors[name].message}</Text>}
    </>
  );
}
