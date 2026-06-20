import type {Plant} from "@/types/plant.types.ts";

export interface PlotArchive {
  id: string;
  garden_plot_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  plants: Plant[];
}