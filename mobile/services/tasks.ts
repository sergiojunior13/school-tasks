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

export async function getAllActivities(): Promise<ActivityData[]> {
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

export async function createActivity({
  title,
  description,
  subject: about,
  deliveryDate: date,
  participants: members,
  points: value,
}: Omit<ActivityData, "id">) {
  const accessToken = await getAccessTokenInStorage();

  interface ParamsData extends Omit<APIActivityData, "id"> {
    access_token: string;
  }

  const params: ParamsData = {
    access_token: accessToken,
    title,
    about,
    description,
    date,
    members: members.join(","),
    members_id: "",
    value,
  };

  const { data } = await api.post("/task", null, { params });

  const { id } = data;

  return {
    title,
    description,
    subject: about,
    deliveryDate: date,
    participants: members,
    points: value,
    id,
  };
}

export async function deleteActivity(activityId: number) {
  const accessToken = await getAccessTokenInStorage();

  const params = {
    id: activityId.toString(),
    access_token: accessToken,
  };

  await api.delete("/task", { params });
}

interface EditActivityParams extends APIActivityData {
  access_token: string;
}

export async function editActivity(activity: ActivityData) {
  const accessToken = await getAccessTokenInStorage();

  const params: EditActivityParams = {
    access_token: accessToken,

    id: activity.id,
    title: activity.title,
    description: activity.description,
    about: activity.subject,
    date: activity.deliveryDate,
    members: activity.participants.join(","),
    value: activity.points,
    members_id: "",
  };

  await api.put("/task", null, { params });

  return activity;
}
