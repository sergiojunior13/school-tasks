import { useState, useContext } from "react";
import { ActivityData, deleteActivity } from "../../services/tasks";

import * as Activity from "./Activity";
import * as Modal from "./Modal";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";
import { Text, View } from "react-native";
import { ActivitiesContext } from "../../context/activities";

export function MountedActivity({
  title,
  subject,
  participants,
  points,
  id,
}: Omit<ActivityData, "description" | "deliveryDate">) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { removeActivity } = useContext(ActivitiesContext);

  return (
    <Activity.Root>
      <MountedModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        removeActivity={removeActivity}
        activityId={id}
      />
      <Activity.Header>
        <Activity.Subject>{subject}</Activity.Subject>

        <Activity.ButtonGroup>
          <Activity.Button className="bg-green-500">
            <Octicons name="check" size={22} color={colors.zinc[50]} />
          </Activity.Button>
          <Activity.Button className="bg-red-500" onPress={() => setIsModalOpen(true)}>
            <Octicons name="trash" size={22} color={colors.zinc[50]} />
          </Activity.Button>
        </Activity.ButtonGroup>
      </Activity.Header>

      <Activity.Content>
        <Activity.ContentTitle>{title}</Activity.ContentTitle>
      </Activity.Content>

      <Activity.Footer>
        {!!participants[0] && (
          <Activity.Participants>{participants.join(", ")}</Activity.Participants>
        )}
        {points > 0 && <Activity.Points>{points.toFixed(1)}pts</Activity.Points>}
      </Activity.Footer>
    </Activity.Root>
  );
}

interface MountedModalProps extends Modal.ModalWithStateProps {
  removeActivity: (activityIndex: number) => void;
  activityId: number;
}

function MountedModal({
  isModalOpen,
  setIsModalOpen,
  removeActivity,
  activityId,
}: MountedModalProps) {
  async function handleDeleteAcitivity() {
    await deleteActivity(activityId);

    setIsModalOpen(false);
    removeActivity(activityId);
  }

  return (
    <Modal.Root visible={isModalOpen}>
      <Modal.Content>
        <Modal.ContentText className="text-center font-sans-semibold text-lg">
          Você tem certeza que deseja excluir essa atividade?
        </Modal.ContentText>
      </Modal.Content>

      <View className="space-y-3 mt-5">
        <Modal.Button
          onPress={() => setIsModalOpen(false)}
          className="bg-green-600 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Cancelar</Text>
        </Modal.Button>
        <Modal.Button
          onPress={handleDeleteAcitivity}
          className="bg-red-600 p-4 items-center justify-center rounded-xl"
        >
          <Text className="font-sans-semibold text-lg text-zinc-50">Excluir</Text>
        </Modal.Button>
      </View>
    </Modal.Root>
  );
}
