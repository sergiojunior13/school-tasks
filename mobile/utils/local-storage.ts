import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { UserData } from "../context/auth";
import { ActivityData } from "../services/tasks";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

const ACTIVITIES_KEY = "activities";
// const ACTIVITIES_ID_FROM_NOT_MADE_DELETE_REQUESTS_KEY = "not_made_delete_requests";
// const ACTIVITIES_DATA_FROM_NOT_MADE_PUT_REQUESTS_KEY = "not_made_put_requests";
// const ACTIVITIES_DATA_FROM_NOT_MADE_POST_REQUESTS_KEY = "not_made_post_requests";

export async function getAccessTokenInStorage() {
  return await getItemAsync(ACCESS_TOKEN_KEY);
}

export async function registerAccessTokenInStorage(accessTokenValue: string) {
  await setItemAsync(ACCESS_TOKEN_KEY, accessTokenValue);
}

export async function removeAccessTokenInStorage() {
  await deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function getUserInStorage(): Promise<UserData | null> {
  const stringifiedUser = await getItemAsync(USER_KEY);

  if (!stringifiedUser) return null;

  return JSON.parse(stringifiedUser);
}

export async function registerUserInStorage(user: UserData) {
  await setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function removeUserInStorage() {
  await deleteItemAsync(USER_KEY);
}

export async function registerActivitiesInStorage(activities: ActivityData[]) {
  await setItemAsync(ACTIVITIES_KEY, JSON.stringify(activities));
}

export async function removeAllActivitiesInStorage() {
  await deleteItemAsync(ACTIVITIES_KEY);
}

export async function removeActivityInStorage(activityId: number) {
  const activities = await getActivitiesInStorage();

  const activitiesWithRemovedItem = activities.filter(({ id }) => id !== activityId);

  await registerActivitiesInStorage(activitiesWithRemovedItem);
}

export async function getActivitiesInStorage(): Promise<ActivityData[]> {
  const stringifiedActivities = await getItemAsync(ACTIVITIES_KEY);
  if (!stringifiedActivities) return [];

  return JSON.parse(stringifiedActivities);
}

export async function editActivityInStorage(activity: ActivityData) {
  const activities = await getActivitiesInStorage();

  const activityIndex = activities.findIndex(({ id }) => id === activity.id);
  const changedActivities = [...activities];
  changedActivities[activityIndex] = activity;

  await registerActivitiesInStorage(changedActivities);
}

// export async function addActivityDataFromNotMadePostRequest(activity: ActivityData[]) {
//   const activitiesDataFromNotMadePostRequests = await getItemAsync(
//     ACTIVITIES_DATA_FROM_NOT_MADE_POST_REQUESTS_KEY
//   );
//   const newActivitiesData = [...activitiesDataFromNotMadePostRequests, activity];

//   await setItemAsync(
//     ACTIVITIES_DATA_FROM_NOT_MADE_POST_REQUESTS_KEY,
//     JSON.stringify(newActivitiesData)
//   );
// }

// export async function addActivityDataFromNotMadePostRequest(activity: ActivityData[]) {
//   const activitiesDataFromNotMadePostRequests = await getItemAsync(
//     ACTIVITIES_DATA_FROM_NOT_MADE_POST_REQUESTS_KEY
//   );
//   const newActivitiesData = [...activitiesDataFromNotMadePostRequests, activity];

//   await setItemAsync(
//     ACTIVITIES_DATA_FROM_NOT_MADE_POST_REQUESTS_KEY,
//     JSON.stringify(newActivitiesData)
//   );
// }
