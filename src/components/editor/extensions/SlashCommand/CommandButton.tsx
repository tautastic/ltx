import { forwardRef } from "react";
import twcx from "~/utils/twcx";
import { type icons } from "lucide-react";
import { Icon } from "~/components/editor/ui/Icon";

export type CommandButtonProps = {
  active?: boolean;
  description: string;
  icon: keyof typeof icons;
  onClick: () => void;
  title: string;
};

export const CommandButton = forwardRef<HTMLButtonElement, CommandButtonProps>(
  ({ active, icon, onClick, title }, ref) => {
    const wrapperClass = twcx(
      "flex text-gray-500 items-center text-xs font-semibold justify-start p-1.5 gap-2 rounded",
      !active && "bg-transparent hover:bg-gray-50 hover:text-black",
      active && "bg-gray-100 text-black hover:bg-gray-100"
    );

    return (
      <button ref={ref} onClick={onClick} className={wrapperClass}>
        <Icon name={icon} className="h-3 w-3" />
        <div className="flex flex-col items-start justify-start">
          <div className="text-sm font-medium">{title}</div>
        </div>
      </button>
    );
  }
);

CommandButton.displayName = "CommandButton";
