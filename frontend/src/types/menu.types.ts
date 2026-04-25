import type {LucideIcon} from "lucide-react";

export interface MenuItem {
  text: string;
  icon: LucideIcon;
  link: string;
  color: string;
  children?: MenuItem[];
}