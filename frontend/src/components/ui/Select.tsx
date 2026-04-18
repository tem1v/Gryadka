import {Label, ListBox, Select as BaseSelect} from "@heroui/react";
import type {ISelectItem} from "@/types/select.types.ts";


interface Props {
  items: ISelectItem[];
  placeholder?: string;
  label?: string;
  value: string;
}

export function Select({items, placeholder, label, value}: Props) {
  return (
    <BaseSelect fullWidth placeholder={placeholder} value={value}>
      {label && <Label>{label}</Label>}
      <BaseSelect.Trigger>
        <BaseSelect.Value />
        <BaseSelect.Indicator className="text-primary"/>
      </BaseSelect.Trigger>
      <BaseSelect.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item id={item.id} textValue={item.textValue}>
              {item.textValue}
              <ListBox.ItemIndicator className="text-primary text-lg"/>
            </ListBox.Item>
          ))}
        </ListBox>
      </BaseSelect.Popover>
    </BaseSelect>
  );
};