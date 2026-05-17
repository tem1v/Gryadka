import {type PropsWithChildren, useState} from "react";
import {Sidebar} from "./sidebar/Sidebar.tsx";
import {PanelLeft} from "lucide-react";
import {cn} from "@heroui/styles";
import { Card } from "@heroui/react";

export function Layout({children}:PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(true);
  return <div className="h-screen flex w-full">
    <Sidebar
    name={'Артём'}
    location={'Казань'}
    isOpen={isOpen}
    onToggle={() => setIsOpen(!isOpen)}
  />
    <Card className={cn("flex items-end mt-2 duration-300 absolute top-1 -left-5 w-25 py-2 z-10", isOpen ? "-translate-x-full pointer-events-none" : "opacity-100")}>
      <button
        onClick={() => setIsOpen(true)}
      >
        <PanelLeft className='text-primary hover:opacity-80 duration-300 cursor-pointer' size={30} strokeWidth={2}/>
      </button>
    </Card>
    <main className='flex-1 p-2 overflow-y-auto pb-25'>
      {children}
    </main>
  </div>
}