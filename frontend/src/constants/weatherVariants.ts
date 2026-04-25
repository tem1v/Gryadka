import {
  LucideCloud,
  LucideCloudLightning,
  LucideCloudRain, type LucideIcon,
  LucideSnowflake,
  LucideSun
} from "lucide-react";
import type {WeatherVariant} from "@/types/weatherVariant.types.ts";

export const WEATHER_VARIANTS: Record<string, WeatherVariant> = {
  "Солнечно":{
    icon: LucideSun,
    color:"#FFC400",
  },
  "Облачно":{
    icon: LucideCloud,
    color:"#087cff",
  },
  "Дождь":{
    icon: LucideCloudRain,
    color:"#8797CC",
  },
  "Гроза":{
    icon: LucideCloudLightning,
    color:"#686868",
  },
  "Снег":{
    icon: LucideSnowflake,
    color:"#7FCBEB",
  },
}

export const getWeatherVariant = (weather:string): WeatherVariant => {
  return WEATHER_VARIANTS[weather]
}