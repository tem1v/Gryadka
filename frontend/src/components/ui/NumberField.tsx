import {NumberField as BaseNumberField} from "@heroui/react";

interface Props {
  value?: number;
  name: string;
};

export function NumberField({value, name}: Props) {
  return (
    <BaseNumberField className="w-auto" defaultValue={value ?? 0} minValue={0} name={name} aria-label={name}>
      <BaseNumberField.Group>
        <BaseNumberField.DecrementButton />
        <BaseNumberField.Input className='text-center min-w-15'/>
        <BaseNumberField.IncrementButton />
      </BaseNumberField.Group>
    </BaseNumberField>
  );
};