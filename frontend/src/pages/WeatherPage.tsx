import type {Weather} from "@/types/weather.types.ts";
import {WeatherCard} from "@/components/features/Weather/WeatherCard.tsx";
import {Card} from "@heroui/react";
import {LucideDroplets, LucideWind} from "lucide-react";
import {getWeatherVariant} from "@/constants/weatherVariants.ts";

interface Props {

};

const mockWeather:Weather[] = [
  {
    day: "Сегодня",
    date: "24.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Снег",
  },
  {
    day: "Завтра",
    date: "25.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Облачно",
  },
  {
    day: "Пт",
    date: "26.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Дождь",
  },
  {
    day: "Пт",
    date: "27.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Гроза",
  },
  {
    day: "Пт",
    date: "27.04.2026",
    temperature: "17",
    humidity: 34,
    wind:15,
    weather: "Солнечно",
  },
]

export function WeatherPage(props: Props) {
  const [today, ...restDays] = mockWeather;
  const weatherIcon = getWeatherVariant(today.weather)
  return (
    <div className='w-full mt-25 flex flex-col items-center'>
      <div className='w-full max-w-[1480px]'>
        <h1 className='mb-15'>Погода</h1>
        <div className='grid md:grid-cols-2 gap-5'>
          <Card className='flex flex-col items-center h-full py-5 px-0'>
            <div className="flex flex-col">
              <span className="font-medium text-xl">{today.day}</span>
              <span className="font-normal text-md opacity-50">{today.date}</span>
            </div>
            <div className="flex flex-row w-full justify-center items-center gap-16 border-b border-gray-200 py-3">
              <div className="flex flex-col items-center">
                <weatherIcon.icon size={140} style={{color:weatherIcon.color}} strokeWidth={1}/>
                <span className="font-normal text-xl opacity-50">{today.weather}</span>
              </div>
              <span className="font-normal text-8xl">{today.temperature}°</span>
            </div>
            <div className='flex flex-row items-center w-full h-full justify-around py-1'>
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
            {restDays.map((plot, index) => (
              <WeatherCard
                key={index}
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