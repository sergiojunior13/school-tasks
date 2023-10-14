import { useState, useContext } from "react";
import { Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { RootBottomTabNavigation } from "../../routes/bottom-tab-navigator";

import * as Activity from "./Activity";
import * as Modal from "./Modal";

import { ActivityData } from "../../services/tasks";
import { ActivitiesContext } from "../../context/activities";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

export function MountedActivity(activity: ActivityData) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { removeActivity } = useContext(ActivitiesContext);

  const { jumpTo } = useNavigation<RootBottomTabNavigation<any>["navigation"]>();

  return (
    <Activity.Root onPress={() => jumpTo("full-activity", activity)}>
      <MountedModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        removeActivity={removeActivity}
        activityId={activity.id}
      />
      <Activity.Header>
        <Activity.Subject>{activity.subject}</Activity.Subject>

        <Activity.ButtonGroup>
          <Activity.Button className="bg-sky-500" onPress={() => jumpTo("edit-activity", activity)}>
            <Octicons name="pencil" size={22} color={colors.zinc[50]} />
          </Activity.Button>
          <Activity.Button className="bg-red-500" onPress={() => setIsModalOpen(true)}>
            <Octicons name="trash" size={22} color={colors.zinc[50]} />
          </Activity.Button>
        </Activity.ButtonGroup>
      </Activity.Header>

      <Activity.Content>
        <Activity.ContentTitle>{activity.title}</Activity.ContentTitle>
      </Activity.Content>

      <Activity.Footer>
        {!!activity.participants[0] && (
          <Activity.Participants>{activity.participants.join(", ")}</Activity.Participants>
        )}
        {activity.points > 0 && <Activity.Points>{activity.points.toFixed(1)}pts</Activity.Points>}
      </Activity.Footer>
    </Activity.Root>
  );
}

interface MountedModalProps extends Modal.ModalWithStateProps {
  removeActivity: (activityIndex: number) => Promise<void>;
  activityId: number;
}

function MountedModal({
  isModalOpen,
  setIsModalOpen,
  removeActivity,
  activityId,
}: MountedModalProps) {
  async function handleDeleteAcitivity() {
    await removeActivity(activityId);

    setIsModalOpen(false);
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
