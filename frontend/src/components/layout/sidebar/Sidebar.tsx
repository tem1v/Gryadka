import { Card } from "@heroui/react";
import {LucideEllipsis, PanelLeft} from "lucide-react";
import icon from "/icon.svg";
import {Menu} from "./Menu.tsx";
import {cn} from "@heroui/styles";
import {Select} from "@/components/ui/Select.tsx";
import type {ISelectItem} from "@/types/select.types.ts";
import {useState} from "react";

interface Props {
  name?: string;
  location?: string;
  isOpen?: boolean;
  onToggle?: () => void;
};

const mockLocations:ISelectItem[] = [
  {
    id: "moskow",
    textValue: "Москва",
  },
  {
    id: "kazan",
    textValue: "Казань",
  },
]


export function Sidebar({name, location, isOpen, onToggle}: Props) {
  return (
    <aside className={cn(
      "transition-all duration-500 overflow-hidden h-full p-2 relative",
      isOpen ? " translate-x-0 opacity-100 w-80" : "-translate-x-full w-0 p-0"
    )}>
      <Card className={cn('flex gap-5 bg-white overflow-hidden w-full h-full px-4 py-7.5 relative transition-all duration-500', isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0' )}>
        <div className='flex items-center justify-between w-full'>
          <img  src={icon} alt='Gryadka'/>
          <button onClick={onToggle}>
            <PanelLeft className='text-primary hover:opacity-80 duration-300 cursor-pointer' size={30} strokeWidth={2}/>
          </button>
        </div>
        <Select items={mockLocations} placeholder={"Выберите населенный пункт"} value={location}/>  {/*TODO from localstorage maybe*/}
        <Menu/>
        <div className='flex items-center justify-between w-full absolute left-0 bottom-0 px-4 py-6 border-t border-gray-200'>
          <span className='font-semibold text-xl'>{name}</span>
          <button className='hover:opacity-50 transition-opacity duration-300'>
            <LucideEllipsis strokeWidth={1} size={30} fill={'#000000'} />
          </button>
        </div>
      </Card>
    </aside>
  )
}