import { createContext, useContext, useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";

import { signUp, logUp } from "../services/auth";
import {
  getAccessTokenInStorage,
  getUserInStorage,
  registerAccessTokenInStorage,
  registerUserInStorage,
  removeAccessTokenInStorage,
  removeAllActivitiesInStorage,
  removeUserInStorage,
} from "../utils/local-storage";

import { ErrorModalContext } from "./error-modal";

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
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserData>(null);
  const [accessToken, setAccessToken] = useState<string>();
  const [isSigned, setIsSigned] = useState(false);

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
    await tryFunctionOrThrowError(async () => {
      const newUser = await signUp(data);
      await logIn(newUser);
    });
  }

  async function logIn(data: UserData) {
    await tryFunctionOrThrowError(async () => {
      const accessToken: string = await logUp(data);

      setAccessToken(accessToken);
      registerAccessTokenInStorage(accessToken);

      setUser(data);
      await registerUserInStorage(data);

      setIsSigned(true);
    });
  }

  async function signOut() {
    await tryFunctionOrThrowError(async () => {
      setIsSigned(false);
      setAccessToken(null);
      setUser(null);

      await removeAccessTokenInStorage();
      await removeUserInStorage();
      await removeAllActivitiesInStorage();
    });
  }

  return (
    <AuthContext.Provider value={{ isSigned, signIn, logIn, signOut, user, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
