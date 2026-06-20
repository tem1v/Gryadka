import { create } from "zustand"
import { loginRequest } from "../api/auth"
import { type User } from "../types/auth.types"
import { type Plot } from "../types/plot.types"
import { persist } from "zustand/middleware"

interface LoginData {
  email: string
  password: string
}

interface AuthState {
  token: string | null
  user: User | null
  plots: Plot[]

  selectedLocation: string | null

  setSelectedLocation: (location: string) => void

  isLoading: boolean
  error: string | null

  login: (data: LoginData) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      plots: [],
      selectedLocation: null,

      setSelectedLocation: (location) =>
        set({ selectedLocation: location }),

      isLoading: false,
      error: null,

      login: async (data) => {
        try {
          set({ isLoading: true, error: null })

          const response = await loginRequest(data)

          const firstLocation =
            response.plots?.[0]?.location ?? null

          set({
            token: response.access_token,
            user: response.user,
            plots: response.plots,
            selectedLocation: firstLocation,
            isLoading: false,
          })

          return true
        } catch (error: any) {
          set({
            error:
              error?.response?.data?.detail ||
              "Ошибка авторизации",
            isLoading: false,
          })

          return false
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          plots: [],
          selectedLocation: null,
        })
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: "auth-storage",
    }
  )
)