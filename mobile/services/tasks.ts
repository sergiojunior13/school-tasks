import { api } from "../utils/axios";
import { getAccessTokenInStorage } from "../utils/local-storage";

export interface ActivityData {
  id: number;
  title: string;
  subject: string;
  description: string;
  deliveryDate: string;
  participants: string[];
  points: number;
  status?: "pending" | "finalized";
}

export async function getAllAPIActivities(): Promise<ActivityData[]> {
  const accessToken = await getAccessTokenInStorage();

  const params = {
    access_token: accessToken,
  };

  const { data } = await api.get("/task", { params });

  if (!data._default) return [];

  const activitiesData: Omit<APIActivityData[], "id"> = Object.values(data._default);
  const activitiesId: string[] = Object.keys(data._default);

  const activities: APIActivityData[] = activitiesData.map((activity, index) => {
    return { ...activity, id: Number(activitiesId[index]) };
  });

  const adaptedActivities = activities.map<ActivityData>(activity => {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      subject: activity.about,
      deliveryDate: activity.date,
      participants: activity.members.split(","),
      points: activity.value,
    };
  });

  return adaptedActivities;
}

export async function createAPIActivity(activity: Omit<ActivityData, "id">) {
  const accessToken = await getAccessTokenInStorage();

  interface ParamsData extends Omit<APIActivityData, "id"> {
    access_token: string;
  }

  const params: ParamsData = {
    access_token: accessToken,
    ...transformActivityToAPIActivityData(activity),
  };

  const { data } = await api.post("/task", null, { params });

  const { id } = data;

  return { ...activity, id };
}

export async function deleteAPIActivity(activityId: number) {
  const accessToken = await getAccessTokenInStorage();

  const params = {
    id: activityId,
    access_token: accessToken,
  };

  await api.delete("/task", { params });
}

interface EditActivityParams extends APIActivityData {
  access_token: string;
}

export async function editAPIActivity(activity: ActivityData) {
  const accessToken = await getAccessTokenInStorage();

  const params: EditActivityParams = {
    access_token: accessToken,

    ...transformActivityToAPIActivityData(activity),
    id: activity.id,
  };

  await api.put("/task", null, { params });
}

export async function replaceAllAPIActivitiesWithActivitiesFromStorage(
  storageActivities: ActivityData[]
) {
  const accessToken = await getAccessTokenInStorage();

  const storageActivitiesWithoutId = storageActivities.map(storageActivity => {
    const activityWithoutId = { ...storageActivity, id: undefined };
    return activityWithoutId;
  });

  const activitiesTransformedToAPIActivities = storageActivitiesWithoutId.map(storageActivity =>
    transformActivityToAPIActivityData(storageActivity)
  );

  const params = {
    access_token: accessToken,
    new_tasks_to_replace: JSON.stringify(activitiesTransformedToAPIActivities),
  };

  await api.post("/tasks", null, { params });
}

interface APIActivityData {
  id: number;
  title: string;
  about: string;
  description: string;
  date: string;
  members: string;
  members_id: string;
  value: number;
}

function transformActivityToAPIActivityData({
  title,
  subject,
  points,
  deliveryDate,
  description,
  participants,
}: ActivityData | Omit<ActivityData, "id">) {
  return {
    title: title,
    description: description,
    about: subject,
    date: deliveryDate,
    members: participants.join(","),
    value: points,
    members_id: "",
  };
}
