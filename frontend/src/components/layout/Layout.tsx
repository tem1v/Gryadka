import type {PropsWithChildren} from "react";
import {Sidebar} from "./sidebar/Sidebar.tsx";

export function Layout({children}:PropsWithChildren) {
  return <div className="min-h-screen h-full flex w-full">
    <Sidebar/>
    <main className='flex-1 p-2.5'>
      {children}
    </main>
  </div>
}