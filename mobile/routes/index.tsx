import { NavigationContainer } from "@react-navigation/native";
import { useContext, useEffect } from "react";

import { AuthContext } from "../context/auth";

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { isSigned } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isSigned ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
