import { create } from "zustand"
import { api } from "@/api/axios.ts"
import type {
  Plot,
  CreatePlotDto,
  UpdatePlotDto
} from "@/types/plot.types.ts"

interface PlotsState {
  plots: Plot[]
  plot: Plot | null
  isLoading: boolean

  getPlots: () => Promise<void>
  getPlotByiId: (id: string) => Promise<void>

  createPlot: (data: CreatePlotDto) => Promise<void>

  updatePlot: (data: UpdatePlotDto) => Promise<void>

  deletePlot: (id: string) => Promise<void>
}

export const usePlotsStore = create<PlotsState>((set, get) => ({

  plots: [],
  isLoading: false,
  plot: null,

  getPlots: async () => {

    try {

      set({ isLoading: true })

      const response = await api.get("/plots")

      set({
        plots: response.data
      })

    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  },

  getPlotByiId: async (id:string) => {
    try {
      set({ isLoading: true })
      const response = await api.get(`/plots/${id}`)
      set({
        plot: response.data
      })
    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  },


  createPlot: async (data) => {

    try {

      const formData = new FormData()

      formData.append("name", data.name)
      formData.append("type", data.type)
      formData.append("location", data.location)

      if (data.image) {
        formData.append("file", data.image)
      }

      const response = await api.post(
        "/plots",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      set({
        plots: [...get().plots, response.data]
      })

    } catch (error) {
      console.error(error)
    }
  },


  updatePlot: async (data) => {

    try {

      const formData = new FormData()

      formData.append("name", data.name)
      formData.append("type", data.type)
      formData.append("location", data.location)

      if (data.image) {
        formData.append("file", data.image)
      }

      const response = await api.put(
        `/plots/${data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )

      set({
        plots: get().plots.map((plot) =>
          plot.id === data.id
            ? response.data
            : plot
        )
      })

    } catch (error) {
      console.error(error)
    }
  },


  deletePlot: async (id) => {

    try {

      await api.delete(`/plots/${id}`)

      set({
        plots: get().plots.filter(
          (plot) => plot.id !== id
        )
      })

    } catch (error) {
      console.error(error)
    }
  }

}))