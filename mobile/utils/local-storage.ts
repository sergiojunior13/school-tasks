import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { UserData } from "../context/auth";
import { ActivityData } from "../services/tasks";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";
const ACTIVITIES_KEY = "activities";
const LOGOUT_REQUEST_KEY = "logout_request";
const HOURS_TO_NOTIFY_KEY = "hours_to_notify";

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

export async function registerLogOutRequestInStorage() {
  const sessionAccessToken = await getAccessTokenInStorage();

  await setItemAsync(LOGOUT_REQUEST_KEY, sessionAccessToken);
}

export async function getPendingLogOutRequestAccessTokenInStorage() {
  const pendingLogOutRequestAccessToken = await getItemAsync(LOGOUT_REQUEST_KEY);
  return pendingLogOutRequestAccessToken;
}

export async function registerHoursToNotify(hoursToNotify: number[]) {
  await setItemAsync(HOURS_TO_NOTIFY_KEY, JSON.stringify(hoursToNotify));
}

export async function getHoursToNotify(): Promise<number[]> {
  const stringifiedHours = await getItemAsync(HOURS_TO_NOTIFY_KEY);

  if (stringifiedHours === null) return [6, 12, 16, 18, 20];

  return JSON.parse(stringifiedHours);
}

export async function removeHoursToNotify() {
  await deleteItemAsync(HOURS_TO_NOTIFY_KEY);
}
