import {type PropsWithChildren, useState} from "react";
import {Sidebar} from "./sidebar/Sidebar.tsx";
import {PanelLeft} from "lucide-react";
import {cn} from "@heroui/styles";

export function Layout({children}:PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(true);
  return <div className="h-screen flex w-full">
    <Sidebar
      name={'Артём'}
      location={'Казань'}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    />
    <button
      onClick={() => setIsOpen(true)}
      className={cn("mt-2.5 duration-300 absolute top-10 left-10", isOpen ? "opacity-0 pointer-events-none" : "opacity-100")}
    >
      <PanelLeft className='text-primary hover:opacity-80 duration-300 cursor-pointer' size={30} strokeWidth={2}/>
    </button>
    <main className='flex-1 p-2'>
      {children}
    </main>
  </div>
}