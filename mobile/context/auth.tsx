import { createContext, useEffect, useState } from "react";

import { signUp, logUp } from "../services/auth";
import {
  getAccessTokenInStorage,
  getUserInStorage,
  registerAccessTokenInStorage,
  registerUserInStorage,
  removeAccessTokenInStorage,
  removeUserInStorage,
} from "../utils/local-storage";

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

  useEffect(() => {
    getAccessTokenInStorage().then(setAccessToken);
    getUserInStorage()
      .then(user => {
        setUser(user);
        return user;
      })
      .then(user => setIsSigned(user != null));
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
    setIsSigned(false);
    setAccessToken(null);
    setUser(null);

    await removeAccessTokenInStorage();
    await removeUserInStorage();
  }

  return (
    <AuthContext.Provider
      value={{ isSigned, signIn, logIn, signOut, user, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
