import type {IWeatherCard} from "@/types/weatherCard.types.ts";
import {WeatherCard} from "@/components/features/Weather/WeatherCard.tsx";
import {Card} from "@heroui/react";
import {LucideCloud, LucideDroplets, LucideWind} from "lucide-react";

interface Props {

};

const mockWeather:IWeatherCard[] = [
  {
    day: "Сегодня",
    date: "24.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Облачно",
  },
  {
    day: "Завтра",
    date: "25.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "cloudy",
  },
  {
    day: "Пт",
    date: "26.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "cloudy",
  },
  {
    day: "Пт",
    date: "27.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "cloudy",
  },
  {
    day: "Пт",
    date: "27.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "cloudy",
  },
]

export function WeatherPage(props: Props) {
  const [today, ...restDays] = mockWeather;
  return (
    <div className='w-full mt-25 flex flex-col items-center'>
      <div className='w-full max-w-[1480px]'>
        <h1 className='mb-15'>Погода</h1>
        <div className='grid grid-cols-2 gap-5'>
          <Card className='flex flex-col items-center h-full p-5 relative'>
            <div className="flex flex-col">
              <span className="font-medium text-xl">{today.day}</span>
              <span className="font-medium text-md text-[#797979]">{today.date}</span>
            </div>
            <div className="flex flex-row justify-between items-center gap-16">
              <div className="flex flex-col items-center">
                <LucideCloud size={140} className="text-[#797979]" strokeWidth={1}/>
                <span className="font-medium text-xl">{today.weather}</span>
              </div>
              <span className="font-medium text-8xl">{today.temperature}°</span>
            </div>
            <div className='flex flex-row items-center w-full justify-around absolute bottom-0 border-t py-5 border-gray-200'>
              <div className="flex flex-row justify-between items-center gap-2.5">
                <LucideDroplets size={40} className="text-[#0084FF]"/>
                <span className="font-medium text-xl">{today.humidity} %</span>
              </div>
              <div className="flex flex-row justify-between items-center gap-2.5">
                <LucideWind size={40} className="text-[#797979]"/>
                <span className="font-medium text-xl">{today.wind} км/ч</span>
              </div>
            </div>
          </Card>
          <div className='flex flex-col w-full gap-2.5'>
            {restDays.map((plot) => (
              <WeatherCard
                key={plot.day}
                day={plot.day}
                date={plot.date}
                temperature={plot.temperature}
                humidity={plot.humidity}
                wind={plot.wind}
                weather={plot.weather}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};