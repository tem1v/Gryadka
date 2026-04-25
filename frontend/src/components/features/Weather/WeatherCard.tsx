import {Card} from "@heroui/react";
import {LucideDroplets, LucideWind, ThermometerSun} from "lucide-react";
import {getWeatherVariant} from "@/constants/weatherVariants.ts";

interface Props {
  day: string;
  date: string;
  temperature: string;
  humidity: number;
  wind: number;
  weather: string;
};

export function WeatherCard({day, date, temperature, humidity, wind, weather}: Props) {
  const weatherIcon = getWeatherVariant(weather)
  return (
    <Card className="flex flex-row justify-between items-center w-full px-16 py-4">
      <div className="flex flex-col">
        <span className="font-medium text-xl">{day}</span>
        <span className="font-normal text-md opacity-50">{date}</span>
      </div>
      <weatherIcon.icon size={40} style={{color:weatherIcon.color}}/>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <ThermometerSun size={40} className="text-[#FF6200]"/>
        <span className="font-normal text-xl">{temperature}°</span>
      </div>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <LucideDroplets size={40} className="text-[#0084FF]"/>
        <span className="font-normal text-xl">{humidity} %</span>
      </div>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <LucideWind size={40} className="text-[#797979]"/>
        <span className="font-normal text-xl">{wind} км/ч</span>
      </div>
    </Card>
  );
};