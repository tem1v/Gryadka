import { create } from "zustand"
import { api } from "@/api/axios.ts"
import type { Plant } from "@/types/plant.types"

interface CreatePlantDto {
  garden_plot_id: string
  name: string
  grade: string
  quantity: number
  status_plant: string
}

interface UpdatePlantDto {
  id: string
  garden_plot_id: string
  name: string
  grade: string
  quantity: number
  status_plant: string
}

interface PlantsState {

  plants: Plant[]

  isLoading: boolean

  getPlantsByPlot: (
    plotId: string
  ) => Promise<void>

  createPlant: (
    data: CreatePlantDto
  ) => Promise<void>

  updatePlant: (
    data: UpdatePlantDto
  ) => Promise<void>

  deletePlant: (
    id: string
  ) => Promise<void>
}

export const usePlantsStore =
  create<PlantsState>((set, get) => ({

    plants: [],

    isLoading: false,

    getPlantsByPlot: async (plotId) => {

      try {

        set({ isLoading: true })

        const response = await api.get(
          `/plants/plot/${plotId}`
        )

        set({
          plants: response.data
        })
        return response.data
      } catch (error) {

        console.error(error)

      } finally {

        set({ isLoading: false })

      }
    },

    createPlant: async (data) => {

      try {

        const response = await api.post(
          "/plants",
          data
        )

        set({
          plants: [
            ...get().plants,
            response.data
          ]
        })

      } catch (error) {

        console.error(error)

      }
    },

    updatePlant: async (data) => {

      try {

        const response = await api.put(
          `/plants/${data.id}`,
          {
            garden_plot_id:
            data.garden_plot_id,

            name: data.name,

            grade: data.grade,

            quantity: data.quantity,

            status_plant: data.status_plant
          }
        )

        set({
          plants: get().plants.map(
            (plant) =>
              plant.id === data.id
                ? response.data
                : plant
          )
        })

      } catch (error) {

        console.error(error)

      }
    },

    deletePlant: async (id) => {

      try {

        await api.delete(`/plants/${id}`)

        set({
          plants: get().plants.filter(
            (plant) =>
              plant.id !== id
          )
        })

      } catch (error) {

        console.error(error)

      }
    }

  }))