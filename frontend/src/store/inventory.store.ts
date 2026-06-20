import { create } from "zustand"

import { api } from "@/api/axios"

import type {
  InventoryItem,
  CreateInventoryItemDto,
  UpdateInventoryItemDto
} from "@/types/inventory.types"

interface InventoryState {

  items: InventoryItem[]

  isLoading: boolean

  getInventory: () => Promise<void>

  createInventoryItem: (
    data: CreateInventoryItemDto
  ) => Promise<void>

  updateInventoryItem: (
    data: UpdateInventoryItemDto
  ) => Promise<void>

  deleteInventoryItem: (
    id: string
  ) => Promise<void>
}

export const useInventoryStore =
  create<InventoryState>((set, get) => ({

    items: [],

    isLoading: false,


    getInventory: async () => {

      try {

        set({ isLoading: true })

        const response =
          await api.get("/inventory")

        set({
          items: response.data
        })

      } catch (error) {

        console.error(error)

      } finally {

        set({ isLoading: false })

      }
    },


    createInventoryItem:
      async (data) => {

        try {

          const response =
            await api.post(
              "/inventory",
              data
            )

          set({
            items: [
              ...get().items,
              response.data
            ]
          })

        } catch (error) {

          console.error(error)

        }
      },


    updateInventoryItem:
      async (data) => {

        try {

          const response =
            await api.put(
              `/inventory/${data.id}`,
              {
                name: data.name,

                item_type:
                data.item_type,

                quantity:
                data.quantity,

                location:
                data.location
              }
            )

          set({
            items: get().items.map(
              (item) =>
                item.id === data.id
                  ? response.data
                  : item
            )
          })

        } catch (error) {

          console.error(error)

        }
      },


    deleteInventoryItem:
      async (id) => {

        try {

          await api.delete(
            `/inventory/${id}`
          )

          set({
            items: get().items.filter(
              (item) =>
                item.id !== id
            )
          })

        } catch (error) {

          console.error(error)

        }
      }

  }))