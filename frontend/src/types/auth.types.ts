import {type Plot} from "@/types/plot.types.ts";

export interface User {
  id: string
  email: string
  first_name: string
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
  plots: Plot[]
}