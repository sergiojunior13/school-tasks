import { createContext, useState } from "react";

interface UserData {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserData;
  isSigned: boolean;
  signIn: (data: UserData) => void;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserData>(null);
  const [isSigned, setIsSigned] = useState(false);

  async function signIn(data: UserData) {
    setIsSigned(true);
    setUser(data);
  }

  async function signOut() {
    setIsSigned(false);
  }

  return (
    <AuthContext.Provider value={{ isSigned, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}
