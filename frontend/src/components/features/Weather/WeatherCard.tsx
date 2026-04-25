import {Card} from "@heroui/react";
import {LucideCloud, LucideDroplets, LucideWind, ThermometerSun} from "lucide-react";

interface Props {
  day: string;
  date: string;
  temperature: string;
  humidity: number;
  wind: number;
  weather: string;
};

export function WeatherCard({day, date, temperature, humidity, wind, weather}: Props) {
  return (
    <Card className="flex flex-row justify-between items-center w-full px-16 py-4">
      <div className="flex flex-col">
        <span className="font-medium text-xl">{day}</span>
        <span className="font-medium text-md text-[#797979]">{date}</span>
      </div>
      <LucideCloud size={40} className="text-[#797979]"/>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <ThermometerSun size={40} className="text-[#FF6200]"/>
        <span className="font-medium text-xl">{temperature}°</span>
      </div>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <LucideDroplets size={40} className="text-[#0084FF]"/>
        <span className="font-medium text-xl">{humidity} %</span>
      </div>
      <div className="flex flex-row justify-between items-center gap-2.5">
        <LucideWind size={40} className="text-[#797979]"/>
        <span className="font-medium text-xl">{wind} км/ч</span>
      </div>
    </Card>
  );
};