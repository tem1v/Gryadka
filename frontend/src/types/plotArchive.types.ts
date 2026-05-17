import type {Plant} from "@/types/plant.types.ts";

export interface PlotArchive {
  id: string;
  gardenId: string;
  createdAt: string;
  closedAt: string;
  archivedPlants: Plant[];
}