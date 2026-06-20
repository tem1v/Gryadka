import { Card } from "@heroui/react";
import {LogOut, LucideEllipsis, LucideSettings, PanelLeft} from "lucide-react";
import icon from "/icon.svg";
import {Menu} from "./Menu.tsx";
import {cn} from "@heroui/styles";
import {Select} from "@/components/ui/Select.tsx";
import type {SelectItem} from "@/types/select.types.ts";
import {Button, Dropdown, Label} from "@heroui/react";
import {type Key, useEffect, useMemo, useState} from "react";
import {useAuthStore} from "@/store/auth.store.ts";
import {useNavigate} from "react-router-dom";
import {usePlotsStore} from "@/store/plots.store.ts";

interface Props {
  name?: string;
  location?: string;
  isOpen?: boolean;
  onToggle?: () => void;
};


export function Sidebar({name,isOpen, onToggle}: Props) {
  const plots = usePlotsStore((state) => state.plots) ?? []
  const getPlots = usePlotsStore(
    (state) => state.getPlots
  )
  useEffect(() => {

    getPlots()

  }, [])
  const locations = useMemo(() => {
    return [...new Set(plots.map(p => p.location))]
  }, [plots])
  const selectedLocation = useAuthStore((state) => state.selectedLocation)
  const setSelectedLocation = useAuthStore(
    (state) => state.setSelectedLocation
  )
  const logout = useAuthStore((state) => state.logout)
  const handleLogout = useLogout()
  useEffect(() => {

    if (!locations.length) return

    if (
      selectedLocation &&
      locations.includes(selectedLocation)
    ) {
      return
    }

    setSelectedLocation(locations[0])

  }, [
    locations,
    selectedLocation,
    setSelectedLocation
  ])
  return (
    <aside className={cn(
      "transition-all duration-500 overflow-hidden h-full p-2 pr-0 relative",
      isOpen ? " translate-x-0 opacity-100 w-80" : "-translate-x-full w-0 p-0"
    )}>
      <Card className={cn('flex gap-5 bg-white overflow-hidden w-full h-full px-4 py-7.5 relative transition-all duration-500', isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0' )}>
        <div className='flex items-center justify-between w-full'>
          <img  src={icon} alt='Gryadka'/>
          <button onClick={onToggle}>
            <PanelLeft className='text-primary hover:opacity-80 duration-300 cursor-pointer' size={30} strokeWidth={2}/>
          </button>
        </div>
        <Select
          items={locations.map((l) => ({ id: l, label: l }))}
          placeholder="Выберите населенный пункт"
          value={locations.includes(selectedLocation ?? "")
            ? selectedLocation
            : ""}
          label="Локация"
          onToggleValue={setSelectedLocation}
        />
        <Menu/>
        <div className='flex items-center justify-between w-full absolute left-0 bottom-0 px-4 py-4.5 border-t border-gray-200'>
          <span className='font-semibold text-xl'>{name}</span>

          <Dropdown>
            <Button isIconOnly className='hover:opacity-50 transition-opacity duration-300 bg-transparent text-black'>
              <LucideEllipsis strokeWidth={2} size={50} fill={'#000000'} />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item id="log-out" textValue="Выйти" className='text-red-600' onClick={handleLogout}>
                  <LogOut size={20}/>
                  <Label className='text-red-600'>Выйти</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </Card>
    </aside>
  )
}

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/sign-in', { replace: true });
  };

  return handleLogout;
};