import { create } from "zustand"

import { api } from "@/api/axios"

import type {
  PlotArchive
} from "@/types/plotArchive.types"

interface ArchivesState {

  archives:  PlotArchive[]
  chartData: ArchiveChartData[]
  isLoading: boolean

  getArchivesByPlot: (
    plotId: string
  ) => Promise< PlotArchive[]>

  createArchive: (
    data: CreateArchiveDto
  ) => Promise<void>

  getArchiveChartData: (
    plotId: string
  ) => Promise<void>
}

interface CreateArchiveDto {
  id: string,
  name: string
}

interface ArchiveChartData {
  name: string
  kg: number
}

export const useArchivesStore =
  create<ArchivesState>((set) => ({

    archives: [],
    chartData: [],
    isLoading: false,

    getArchivesByPlot: async (
      plotId
    ) => {

      try {

        set({
          isLoading: true
        })

        const response = await api.get(
          `/archives/plot/${plotId}`
        )

        set({
          archives: response.data
        })

        return response.data

      } catch (error) {

        console.error(error)

        return []

      } finally {

        set({
          isLoading: false
        })
      }
    },

    createArchive: async (data) => {
      try {

        await api.post(
          `/archives/plot/${data.id}`, {name: data.name}
        )
      } catch (error) {
        console.error(error)
      }
    },
    getArchiveChartData: async (
      plotId
    ) => {

      try {

        set({ isLoading: true })

        const response = await api.get(
          `/archives/stats/chart-data/${plotId}`
        )

        set({
          chartData: response.data
        })

      } catch (error) {

        console.error(error)

      } finally {

        set({ isLoading: false })

      }
    }
  }))