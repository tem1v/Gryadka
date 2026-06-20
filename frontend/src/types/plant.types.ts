export interface Plant {
  id: string;
  garden_plot_id: string;
  name: string;
  grade: string;
  quantity: number;
  status: string;
  created_at: string;
  total_yield_amount: number;
  yield_unit: string
  photos?: PlantPhoto[]
}

export interface PlantPhoto {
  id: string,
  plant_id: string,
  image_url: string,
  caption: null,
  status: string,
  disease_detected?: string,
  disease_name_ru?: string,
  treatment?: string,
  confidence?: number,
  created_at: string
}
