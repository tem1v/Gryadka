export interface Plot {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  image_url: string;
  location: string;
  closedAt?: string;
}

export interface CreatePlotDto {
  name: string
  type: string
  location: string
  image?: File | null
}

export interface UpdatePlotDto {
  id: string
  name: string
  type: string
  location: string
  image?: File | null
}