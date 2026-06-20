export type InventoryItemType =
  | "tool"
  | "seeds"
  | "fertilizer"

export interface InventoryItem {
  id: string

  user_id: string

  name: string

  item_type: InventoryItemType

  quantity: number

  location: string | null

  created_at: string
}

export interface CreateInventoryItemDto {
  name: string

  item_type: InventoryItemType

  quantity: number

  location?: string | null
}

export interface UpdateInventoryItemDto {
  id: string

  name: string

  item_type: InventoryItemType

  quantity: number

  location?: string | null
}