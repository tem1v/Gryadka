import {LucideSquarePen, LucideTrash2} from "lucide-react";

interface Props {
  onEdit?: () => void,
  onDelete?: () => void,
  size?: number,
};

export function ActionButtons({onEdit, onDelete, size}: Props) {
  return (
    <div className="flex gap-3.5 cursor-pointer">
      <button className="cursor-pointer transition-all duration-300 hover:opacity-60" onClick={onEdit}>
        <LucideSquarePen size={size} />
      </button>
      <button className="text-red-600 transition-all cursor-pointer duration-300 hover:opacity-60" onClick={onDelete}>
        <LucideTrash2 size={size} />
      </button>
    </div>
  );
};