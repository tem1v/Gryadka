import type {LucideIcon} from "lucide-react";

export interface IMenuItem {
  text: string;
  icon?: LucideIcon;
  link: string;
  color: string;
  children?: IMenuItem[];
}