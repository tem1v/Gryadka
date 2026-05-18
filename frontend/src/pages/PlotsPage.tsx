import {Button} from "@/components/ui/Button.tsx";
import {LucidePlus} from "lucide-react";
import type {Plot} from "@/types/plot.types.ts";
import {PlotCard} from "@/components/features/Plot/PlotCard.tsx";


interface Props {

};

const mockPlots:Plot[] = [
  {
    id:"1",
    userId:"1",
    name:"Огород за окном",
    createdAt: "2026-06-01",
    photo:"",
    location:'',
  },
  {
    id:"2",
    userId:"1",
    name:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    location:'',
  },
  {
    id:"3",
    userId:"1",
    name:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    location:'',
  },
  {
    id:"4",
    userId:"1",
    name:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    location:'',
  },
  {
    id:"5",
    userId:"1",
    name:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:"",
    location:'',
  }
]

export function PlotsPage(props: Props) {
  return (
    <div className='mx-auto w-fit mt-25'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Участки</h1>
        <Button>
          <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
        </Button>
      </div>
      <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {mockPlots.map((plot) => (
          <PlotCard key={plot.id} id={plot.id} title={plot.name} createdAt={plot.createdAt} photo={plot.photo}/>
        ))}
      </div>
    </div>
  );
};