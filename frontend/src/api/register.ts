import {api} from "@/api/axios.ts";

export const registerRequest = async (payload: any) => {
  const res = await api.post("/auth/register", payload)
  return res.data
}