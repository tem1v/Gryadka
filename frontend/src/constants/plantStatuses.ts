import type {PlantStatus} from "@/types/plantStatus.types.ts";

export const PLANT_STATUSES:Record<string, PlantStatus> = {
  seedling: {
    label: "Рассада",
    color: "#13E300",
  },

  planted: {
    label: "В грунте",
    color: "#006FEE",
  },

  flowering: {
    label: "Цветет",
    color: "#F5A524",
  },

  fruiting: {
    label: "Плодоносит",
    color: "#7828C8",
  },

  sick: {
    label: "Болеет",
    color: "#EE0000",
  },

  harvested: {
    label: "Убрано",
    color: "#4e4e4e",
  }
}