import { create } from "zustand"
import { api } from "@/api/axios"
import type {
  Harvest,
  CreateHarvestDto
} from "@/types/harvest.types"

interface HarvestsState {

  harvests: Harvest[]

  isLoading: boolean

  getHarvestsByPlant: (
    plantId: string
  ) => Promise<void>

  createHarvest: (
    data: CreateHarvestDto
  ) => Promise<void>

  deleteHarvest: (
    harvestId: string
  ) => Promise<void>
}

export const useHarvestsStore =
  create<HarvestsState>((set, get) => ({

    harvests: [],

    isLoading: false,

    getHarvestsByPlant: async (
      plantId
    ) => {

      try {

        set({ isLoading: true })

        const response = await api.get(
          `/harvests/plant/${plantId}`
        )

        set({
          harvests: response.data
        })

      } catch (error) {

        console.error(error)

      } finally {

        set({ isLoading: false })

      }
    },

    createHarvest: async (
      data
    ) => {

      try {

        const response = await api.post(
          "/harvests",
          data
        )

        set({
          harvests: [
            ...get().harvests,
            response.data
          ]
        })

      } catch (error) {

        console.error(error)

      }
    },

    deleteHarvest: async (
      harvestId
    ) => {

      try {

        await api.delete(
          `/harvests/${harvestId}`
        )

        set({
          harvests: get().harvests.filter(
            (harvest) =>
              harvest.id !== harvestId
          )
        })

      } catch (error) {

        console.error(error)

      }
    }
  }))