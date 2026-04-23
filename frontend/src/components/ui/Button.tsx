import {Button as BaseButton} from "@heroui/react";

interface Props {
  children: React.ReactNode
};

export function Button({children}: Props) {
  return (
    <BaseButton
      className='text-white bg-primary rounded-xl px-5 py-5.5 transition-all duration-300 hover:opacity-90 hover:scale-102'
      onPress={() => console.log("Button pressed")}
    >
      {children}
    </BaseButton>
  );
};