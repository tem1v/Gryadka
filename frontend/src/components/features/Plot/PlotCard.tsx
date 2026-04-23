import {Card} from "@heroui/react";
import {LucideSquarePen, LucideTrash2} from "lucide-react";

interface Props {
  title: string;
  createdAt: string;
  photo?: string;
};

export function PlotCard({title, createdAt, photo}: Props) {
  return (
    <Card className="p-0 w-fit relative transition duration-300 hover:scale-101">
      <div className="max-w-120 max-h-60 overflow-hidden">
        <img src={photo || "/plot3.avif"} alt={title} className="w-full" />
      </div>
      <div className="flex items-center justify-between w-full px-5 pb-5">
        <div className='flex flex-col items-start justify-between'>
          <h3>{title}</h3>
          <span>Создан: {createdAt}</span>
        </div>
        <div className="flex gap-3.5">
          <button><LucideSquarePen/></button>
          <button className="text-red-600"><LucideTrash2/></button>
        </div>
      </div>
    </Card>
  );
};