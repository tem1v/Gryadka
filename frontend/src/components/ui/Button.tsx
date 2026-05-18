import {Button as BaseButton} from "@heroui/react";
import {cn} from "@heroui/styles";

interface Props {
  children: React.ReactNode,
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function Button({children, className, type, onClick}: Props) {
  return (
    <BaseButton
      className={cn(`text-white bg-primary rounded-xl px-5 py-5.5 transition-all duration-300 hover:opacity-90 hover:scale-102`, className)}
      onPress={() => console.log("Button pressed")}
      type={type}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  );
};