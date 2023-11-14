import { useState } from "react";
import { Platform, TouchableOpacity, Text, View } from "react-native";
import { ControllerRenderProps, FieldErrors } from "react-hook-form";

import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { ActivityData } from "../../services/tasks";

import { Icon } from "./Icon";
import colors from "tailwindcss/colors";
import dayjs from "dayjs";

interface DateInputProps extends ControllerRenderProps<ActivityData, "deliveryDate"> {
  mode?: "date" | "time";
  label?: string;
  viewClassName?: string;
  errors: FieldErrors<ActivityData>;
}

export function DateInput({
  onChange,
  value: date,
  mode = "date",
  label,
  viewClassName,
  errors,
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(_, date: Date) {
    onChange(dayjs(date).startOf("day").toISOString());
  }

  function showDateInput() {
    if (Platform.OS == "android") {
      DateTimePickerAndroid.open({
        value: new Date(date || null),
        onChange: handleChange,
        mode,
        is24Hour: true,
        minimumDate: new Date(),
      });
    } else {
      setIsOpen(true);
    }
  }

  return (
    <View className={label && "space-y-2 " + viewClassName}>
      {label && <Text className="text-zinc-50 text-xl font-sans-bold">{label}</Text>}
      <TouchableOpacity
        onPress={showDateInput}
        activeOpacity={0.7}
        className="flex-row space-x-2 bg-zinc-700 rounded-lg justify-center items-center p-4 active:border-2 active:border-sky-500"
        style={{
          borderColor: errors["deliveryDate"] ? colors.red[600] : colors.sky[500],
          borderWidth: errors["deliveryDate"] ? 2 : 0,
        }}
      >
        <Icon name="calendar" size={24} />
        <Text className="text-zinc-50 font-sans-semibold text-base">
          {date ? dayjs(date).format("DD/MM/YY") : "Selecionar data"}
        </Text>

        {isOpen && Platform.OS != "android" && (
          <DateTimePicker
            value={new Date(date || null)}
            is24Hour
            mode={mode}
            onChange={handleChange}
            minimumDate={new Date()}
          />
        )}
      </TouchableOpacity>
      {errors["deliveryDate"] && (
        <Text className="text-red-600 font-sans">{errors["deliveryDate"].message}</Text>
      )}
    </View>
  );
}
