import {Button} from "@/components/ui/Button.tsx";
import {LucidePlus} from "lucide-react";
import type {IPlotCard} from "@/types/plotCard.tyes.ts";
import {PlotCard} from "@/components/features/Plot/PlotCard.tsx";


interface Props {

};

const mockPlots:IPlotCard[] = [
  {
    id:"1",
    title:"Огород за окном",
    createdAt: "2026-06-01",
    photo:""
  },
  {
    id:"2",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"3",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"4",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  },
  {
    id:"5",
    title:"Огород за сараем",
    createdAt: "2026-06-03",
    photo:""
  }
]

export function PlotsPage(props: Props) {
  return (
    <div className='mx-auto w-fit my-25'>
      <div className='flex items-center justify-between mb-15'>
        <h1>Участки</h1>
        <Button>
          <LucidePlus className="w-5 h-5 m-0 p-0" strokeWidth={2}/>
        </Button>
      </div>
      <div className='grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {mockPlots.map((plot) => (
          <PlotCard key={plot.id} title={plot.title} createdAt={plot.createdAt} photo={plot.photo}/>
        ))}
      </div>
    </div>
  );
};