import { create } from "zustand"
import { api } from "@/api/axios.ts"
import type {PlantPhoto} from "@/types/plant.types"

interface PlantPhotosState {

  photos: PlantPhoto[]

  isLoading: boolean

  createPlantPhoto: (
    plantId: string,
    file: File
  ) => Promise<void>

  deletePlantPhoto: (
    photoId: string
  ) => Promise<void>

  setPhotos: (
    photos: PlantPhoto[]
  ) => void
}

export const usePlantPhotosStore = create<PlantPhotosState>((set, get) => ({
  photos:[],
  isLoading: false,
  setPhotos:(photos) => set({photos}),

  createPlantPhoto: async(plantId, file) => {
    try {
      set({isLoading:true})
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post(
        `/plants/${plantId}/photos`,
        formData, {
          headers:{
            "Content-Type": "multipart/form-data",
          }
        }
      )

      set({
        photos: response.data,
      })

    } catch (error) {

      console.error(error)

    } finally {

      set({ isLoading: false })

    }
  },

  deletePlantPhoto: async (photoId) => {
    try {

      await api.delete(`/plants/photos/${photoId}`)

      set({
        photos: get().photos.filter(
          (photo) =>
            photo.id !== photoId
        )
      })


    } catch (error) {

      console.error(error)

    }
  }
}))