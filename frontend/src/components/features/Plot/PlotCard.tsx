import {Card} from "@heroui/react";
import {LucideSquarePen, LucideTrash2} from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  createdAt: string;
  photo?: string;
};

export function PlotCard({id, title, createdAt, photo}: Props) {
  return (
    <Card className="p-0 w-fit relative transition duration-300 hover:scale-101">
      <Link to={`/plots/${id}`}>
        <div className="max-w-120 max-h-60 overflow-hidden">
          <img src={photo || "/plot3.avif"} alt={title} className="w-full" />
        </div>
        <div className="flex items-center justify-between w-full px-5 py-3">
          <div className='flex flex-col items-start justify-between'>
            <h3>{title}</h3>
            <span>Создан: {createdAt}</span>
          </div>
          <div className="flex gap-3.5 cursor-pointer">
            <button className="cursor-pointer transition-all duration-300 hover:opacity-60"><LucideSquarePen/></button>
            <button className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60"><LucideTrash2/></button>
          </div>
        </div>
      </Link>
    </Card>
  );
};