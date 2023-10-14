import { useContext, useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, TextInput } from "react-native";
import { Controller, useForm } from "react-hook-form";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

import { ActivityFormTextInput } from "../src/components/ActivityFormTextInput";
import { StyledTextInput } from "../src/components/StyledTextInput";
import * as Modal from "../src/components/Modal";

import { RootBottomTabNavigation } from "../routes/bottom-tab-navigator";

import { ActivityData, editActivity } from "../services/tasks";
import { DateInput } from "../src/components/DateInput";
import { ActivitiesContext } from "../context/activities";

export function EditActivity({
  navigation: { goBack },
  route,
}: RootBottomTabNavigation<"edit-activity">) {
  const { params: activity }: { params?: ActivityData } = route;

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
  } = useForm<ActivityData>({
    defaultValues: {
      ...activity,
      participants: activity.participants.filter(participant => participant !== ""),
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { changeActivity } = useContext(ActivitiesContext);

  function handleChangeIsModalOpen() {
    setIsModalOpen(isOpen => !isOpen);
  }

  function addParticipant(participant: string) {
    const participants = getValues("participants");
    setValue("participants", [...participants, participant]);
  }

  function deleteParticipant(participantIndex: number) {
    const participants = getValues("participants");
    participants.splice(participantIndex, 1);

    setValue("participants", participants);
  }

  async function onSubmit(data: ActivityData) {
    if (!data.description) {
      data.description = data.title;
    }

    await changeActivity(data);
    goBack();
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <MountedModal
        addParticipant={addParticipant}
        isModalOpen={isModalOpen}
        handleChangeIsModalOpen={handleChangeIsModalOpen}
      />

      <View className="pt-3 px-3 space-y-2">
        <View className="px-2 flex-row space-x-5 items-center">
          <TouchableOpacity activeOpacity={0.7} onPress={goBack} className="p-4 pl-0">
            <Octicons name="chevron-left" color={colors.zinc[50]} size={32} />
          </TouchableOpacity>
          <Text className="text-center text-zinc-50 text-2xl font-sans-bold">Editar Atividade</Text>
        </View>
        <View className="space-y-8">
          <Controller
            control={control}
            rules={{ required: "Nome é obrigatório" }}
            name="title"
            render={({ field }) => <ActivityFormTextInput {...field} ref={null} errors={errors} />}
          />
          <Controller
            control={control}
            rules={{ required: "Matéria é obrigatória" }}
            name="subject"
            render={({ field }) => <ActivityFormTextInput {...field} ref={null} errors={errors} />}
          />
          <Controller
            control={control}
            rules={{ required: "Data de entrega é obrigatória" }}
            name="deliveryDate"
            render={({ field }) => (
              <DateInput
                {...field}
                ref={null}
                label="Data de entrega*"
                viewClassName="mt-8"
                errors={errors}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => <ActivityFormTextInput {...field} ref={null} errors={errors} />}
          />

          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">Valor</Text>
            <View className="flex-row items-center">
              <Controller
                control={control}
                name="points"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    className="text-zinc-50 font-sans text-lg border-b border-zinc-400 focus:border-sky-500 text-center px-2"
                    keyboardType="number-pad"
                    value={value.toString()}
                    onChangeText={points => onChange(Number(points))}
                    onBlur={onBlur}
                  />
                )}
              />
              <Text className="text-zinc-400 font-sans text-lg"> pontos</Text>
            </View>
          </View>
          <View className="space-y-2">
            <Text className="text-zinc-50 text-xl font-sans-bold">Participantes</Text>
            <View className="flex-row flex-wrap gap-2">
              {watch("participants").map((participant, participantIndex) => (
                <TouchableOpacity
                  key={participantIndex}
                  className="p-2 px-3 bg-sky-500 rounded-full justify-center items-center flex-row space-x-2"
                  activeOpacity={0.7}
                  onPress={() => deleteParticipant(participantIndex)}
                >
                  <Text className="text-zinc-50 font-sans-bold">{participant}</Text>
                  <Octicons name="x" size={20} color={colors.zinc[50]} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="p-2 px-3 bg-sky-500 rounded-full justify-center items-center flex-row space-x-2"
                activeOpacity={0.7}
                onPress={() => setIsModalOpen(true)}
              >
                <Octicons name="plus" size={20} color={colors.zinc[50]} />
                <Text className="text-zinc-50 font-sans-bold">Add. Participante</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSubmit(onSubmit)}
            className="bg-green-600 rounded-xl justify-center items-center flex-row space-x-2 py-3"
          >
            <Octicons name="pencil" color={colors.zinc[50]} size={24} />
            <Text className="text-zinc-50 font-sans-semibold text-xl">Editar Atividade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

interface MountedModalProps {
  isModalOpen: boolean;
  handleChangeIsModalOpen: () => void;
  addParticipant: (participant: string) => void;
}

function MountedModal({ handleChangeIsModalOpen, isModalOpen, addParticipant }: MountedModalProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<{ participant: string }>();

  function onSubmit(data: { participant: string }) {
    setValue("participant", undefined);
    handleChangeIsModalOpen();

    addParticipant(data.participant);
  }

  return (
    <Modal.Root visible={isModalOpen}>
      <Modal.Header>
        <Modal.HeaderText>Add. Participante</Modal.HeaderText>
        <TouchableOpacity className="p-2" activeOpacity={0.7} onPress={handleChangeIsModalOpen}>
          <Octicons name="x" size={32} color={colors.red[600]} />
        </TouchableOpacity>
      </Modal.Header>
      <Modal.Content>
        <Controller
          control={control}
          rules={{ required: true }}
          name="participant"
          render={({ field: { onBlur, onChange, value } }) => (
            <StyledTextInput
              autoFocus
              onSubmitEditing={handleSubmit(onSubmit)}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              data-isinvalid={!!errors.participant}
              placeholder="Digite o nome do participante..."
              label="Participante"
            />
          )}
        />
      </Modal.Content>
      <Modal.Button
        activeOpacity={0.7}
        onPress={handleSubmit(onSubmit)}
        className="bg-sky-600 p-3 rounded-xl flex-row gap-x-2 items-center justify-center mt-8"
      >
        <Octicons name="plus" size={28} color={colors.zinc[50]} />
        <Text className="text-zinc-50 font-sans-semibold text-lg">Add. Participante</Text>
      </Modal.Button>
    </Modal.Root>
  );
}
