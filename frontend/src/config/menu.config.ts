import type {IMenuItem} from "../types/menu.types.ts";
import {ROUTES} from "./routes.config.ts";
import {
  type LucideIcon,
  LucideListChecks,
  LucideSprout,
  LucideToolCase
} from "lucide-react";

export const getMenuItems = (weatherIcon: LucideIcon) => [
  ...MENU,
  {
    text: 'Погода',
    link: ROUTES.WEATHER,
    icon: weatherIcon,
    color: '#0061CF'
  },
]

export const MENU : IMenuItem[] = [
  {text:'Участки', link:ROUTES.PLOTS, icon:LucideSprout, color:'#2E7700'},
  {text:'Инвентарь', link:ROUTES.INVENTORY, icon:LucideToolCase, color:'#995F00'},
  {text:'Задачи', link:ROUTES.TASKS, icon:LucideListChecks, color:'#FF2020'},
]