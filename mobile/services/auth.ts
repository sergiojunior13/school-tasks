import { RawAxiosRequestHeaders } from "axios";
import { api } from "../utils/axios";

import { deviceName } from "expo-device";

interface SignUpData {
  email: string;
  password: string;
}

export async function signUp({ email, password }: SignUpData) {
  const data = { username: email, password };
  const headers: RawAxiosRequestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  await api.post("/signup", data, { headers }).catch(err => {
    throw err.response.data.detail;
  });

  return { email, password };
}

export async function logUp({ email, password }: SignUpData) {
  const data = { username: email, password };

  const headers: RawAxiosRequestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await api
    .post("/login", data, { headers, params: { device_name: deviceName } })
    .catch(err => {
      if (err.response.status == 401) {
        throw "Email ou senha inválidos";
      }
    });

  if (!response) return "Email ou senha inválidos";

  return response.data.access_token;
}
