import { api } from "./axios"
import type {LoginResponse} from "../types/auth.types"

interface LoginPayload {
  email: string
  password: string
}

export const loginRequest = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data)

  return response.data
}