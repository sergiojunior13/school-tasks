import { createContext, useContext, useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { signUp, logUp, logOut } from "../services/auth";
import {
  registerLogOutRequestInStorage,
  getAccessTokenInStorage,
  getUserInStorage,
  registerAccessTokenInStorage,
  registerUserInStorage,
  removeAccessTokenInStorage,
  removeAllActivitiesInStorage,
  removeUserInStorage,
  removeHoursToNotify,
} from "../utils/local-storage";

import { ErrorModalContext } from "./error-modal";
import { useNetInfo } from "@react-native-community/netinfo";
import { cancelAllNotifications } from "../utils/notification";

export interface UserData {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserData;
  isSigned: boolean;
  signIn: (data: UserData) => Promise<void>;
  logIn: (data: UserData) => Promise<void>;
  signOut: () => void;
  accessToken: string;
  isLoggingOut: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserData>(null);
  const [accessToken, setAccessToken] = useState<string>();
  const [isSigned, setIsSigned] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isConnectedToInternet = useNetInfo({
    reachabilityUrl: process.env.EXPO_PUBLIC_API_URL,
    reachabilityRequestTimeout: 15 * 1000,
  }).isInternetReachable;

  const { tryFunctionOrThrowError } = useContext(ErrorModalContext);

  useEffect(() => {
    async function loadUserAndAccessToken() {
      await getAccessTokenInStorage().then(setAccessToken);
      await getUserInStorage().then(user => {
        setUser(user);
        setIsSigned(user != null);
      });

      await SplashScreen.hideAsync();
    }

    tryFunctionOrThrowError(loadUserAndAccessToken);
  }, []);

  async function signIn(data: UserData) {
    const newUser = await signUp(data);
    await logIn(newUser);
  }

  async function logIn(data: UserData) {
    const accessToken: string = await logUp(data);

    setAccessToken(accessToken);
    registerAccessTokenInStorage(accessToken);

    setUser(data);
    await registerUserInStorage(data);

    setIsSigned(true);
  }

  async function signOut() {
    setIsLoggingOut(true);

    await tryFunctionOrThrowError(async () => {
      if (isConnectedToInternet) {
        await logOut();
      } else {
        await registerLogOutRequestInStorage();
      }

      await removeAccessTokenInStorage();
      await removeUserInStorage();
      await removeAllActivitiesInStorage();
      await removeHoursToNotify();
      await cancelAllNotifications();

      setIsSigned(false);
      setAccessToken(null);
      setUser(null);
    });

    setIsLoggingOut(false);
  }

  return (
    <AuthContext.Provider
      value={{ isSigned, signIn, logIn, signOut, user, accessToken, isLoggingOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
