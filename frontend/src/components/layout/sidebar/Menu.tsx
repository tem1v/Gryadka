import type {IMenuItem} from "@/types/menu.types.ts";
import {getMenuItems} from "@/config/menu.config.ts";
import {LucideSun} from "lucide-react";

export function Menu() {
  const menu:IMenuItem[] = getMenuItems(LucideSun);
  return (
    <ul className="">
      {menu.map((item:IMenuItem) => (
        <li className="p-2 rounded-2xl hover:bg-[#f0f0f0] duration-300 cursor-pointer">
          <a className='flex items-center gap-2' style={{color: `${item.color}`}}>
            <item.icon size={30} strokeWidth={2}/>
            <span className='font-semibold text-xl'>{item.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};