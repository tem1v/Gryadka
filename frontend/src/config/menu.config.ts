import type {MenuItem} from "../types/menu.types.ts";
import {ROUTES} from "./routes.config.ts";
import {
  type LucideIcon,
  LucideListChecks, LucideMicroscope,
  LucideSprout,
  LucideToolCase
} from "lucide-react";

export const getMenuItems = (weatherIcon: LucideIcon) => [
  ...MENU,
]

export const MENU : MenuItem[] = [
  {text:'Участки', link:ROUTES.PLOTS, icon:LucideSprout, color:'#2E7700'},
  {text:'Инвентарь', link:ROUTES.INVENTORY, icon:LucideToolCase, color:'#995F00'},
  {text:'Задачи', link:ROUTES.TASKS, icon:LucideListChecks, color:'#FF2020'},
  {text:'Диагностика', link:ROUTES.AI, icon:LucideMicroscope, color:'#0061CF'},
]