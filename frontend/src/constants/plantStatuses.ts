import type {PlantStatus} from "@/types/plantStatus.types.ts";

export const PLANT_STATUSES:Record<string, PlantStatus> = {
  "Рассада":{
    color:"#13E300",
  },
  "В грунте":{
    color:"#006FEE",
  },
  "Цветение":{
    color:"#F5A524",
  },
  "Плодоносит":{
    color:"#7828C8",
  },
  "Болеет":{
    color:"#EE0000",
  },
  "Убрано":{
    color:"#9A5C05",
  }
}