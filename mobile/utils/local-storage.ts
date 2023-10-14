import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { UserData } from "../context/auth";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

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

  if (stringifiedUser === null) return null;

  return JSON.parse(stringifiedUser);
}

export async function registerUserInStorage(user: UserData) {
  await setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function removeUserInStorage() {
  await deleteItemAsync(USER_KEY);
}
