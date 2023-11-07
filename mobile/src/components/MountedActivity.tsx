import { useNavigation } from "@react-navigation/native";
import { RootBottomTabNavigation } from "../../routes/bottom-tab-navigator";

import * as Activity from "./Activity";

import { ActivityData } from "../../services/tasks";

import Octicons from "@expo/vector-icons/Octicons";
import colors from "tailwindcss/colors";

import { calculateDiffOfDateAndTodayInDays } from "../../utils/date";

interface MountedActivityProps {
  activity: ActivityData;
  openRemoveActivityModal: (activityId: number) => void;
  openFinalizeActivityModal: (activity: ActivityData) => void;
}

export function MountedActivity({
  activity,
  openRemoveActivityModal,
  openFinalizeActivityModal,
}: MountedActivityProps) {
  const { jumpTo } = useNavigation<RootBottomTabNavigation<any>["navigation"]>();

  let alertMessage = null;

  if (activity.status === "finalized") {
    alertMessage = "• Finalizada";
  } else if (calculateDiffOfDateAndTodayInDays(activity.deliveryDate) < 0) {
    alertMessage = "• Atrasada";
  }

  return (
    <Activity.Root onPress={() => jumpTo("full-activity", activity)}>
      <Activity.Header>
        <Activity.AlertContainer>
          <Activity.Subject>{activity.subject}</Activity.Subject>
          {alertMessage && <Activity.Alert>{alertMessage}</Activity.Alert>}
        </Activity.AlertContainer>

        <Activity.ButtonGroup>
          {activity.status !== "finalized" && (
            <Activity.Button
              className="bg-green-500"
              onPress={() => openFinalizeActivityModal(activity)}
            >
              <Octicons name="check" size={22} color={colors.zinc[50]} />
            </Activity.Button>
          )}
          <Activity.Button
            className="bg-red-500"
            onPress={() => openRemoveActivityModal(activity.id)}
          >
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
