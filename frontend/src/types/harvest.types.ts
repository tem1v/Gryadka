export interface Harvest {
  id: string
  plant_id: string
  weight: number
  harvest_date: string
  created_at: string
}

export interface CreateHarvestDto {
  plant_id: string
  weight: number
  harvest_date: string
}