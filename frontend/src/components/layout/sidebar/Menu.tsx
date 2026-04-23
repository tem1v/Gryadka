import type {IMenuItem} from "@/types/menu.types.ts";
import {getMenuItems} from "@/config/menu.config.ts";
import {LucideSun} from "lucide-react";
import {NavLink} from "react-router-dom";
import {cn} from "@heroui/styles";

export function Menu() {
  const menu:IMenuItem[] = getMenuItems(LucideSun);
  return (
    <ul>
      {menu.map((item:IMenuItem) => (
        <li>
          <NavLink className={({isActive}) => cn('p-2 rounded-2xl hover:bg-[#f0f0f0] hover:gap-7 duration-300 cursor-pointer flex items-center transition-all', isActive ? "gap-7 " : "gap-2")} style={{color: `${item.color}`}} to={item.link}>
            <item.icon size={30} strokeWidth={2}/>
            <span className='font-semibold text-xl'>{item.text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};