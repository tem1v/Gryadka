import {Label, ListBox, Select as BaseSelect} from "@heroui/react";
import type {SelectItem} from "@/types/select.types.ts";
import {LucideMapPin} from "lucide-react";


interface Props {
  items: SelectItem[];
  placeholder?: string;
  label: string;
  value: string;
  isLabelVisible?: boolean;
  onToggleValue: (value: string) => void;
}

export function Select({items, placeholder, label, value, isLabelVisible, onToggleValue}: Props) {
  return (
    <BaseSelect fullWidth placeholder={placeholder} value={value} aria-label={label} onChange={(selectedId) => {
      if (selectedId && typeof selectedId === 'string') {
        onToggleValue(selectedId);
      }
    }}>
      {isLabelVisible && <Label>{label}</Label>}
      <BaseSelect.Trigger className='flex items-center gap-2'>
        <LucideMapPin size={25} className='text-orange-400'/>
        <BaseSelect.Value/>
        <BaseSelect.Indicator className="text-primary"/>
      </BaseSelect.Trigger>
      <BaseSelect.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item id={item.id} textValue={item.label}>
              {item.label}
              <ListBox.ItemIndicator className="text-primary text-lg"/>
            </ListBox.Item>
          ))}
        </ListBox>
      </BaseSelect.Popover>
    </BaseSelect>
  );
};