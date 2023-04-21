import twcx from "~/utils/twcx";

export const DropdownCategoryTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-1 px-1.5 text-[.65rem] font-semibold uppercase text-gray-500 dark:text-gray-400">
      {children}
    </div>
  );
};

export const DropdownButton = ({
  children,
  isActive,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const buttonClass = twcx(
    "flex items-center gap-2 p-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 text-left bg-transparent w-full rounded",
    !isActive && !disabled,
    "hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-200",
    isActive && !disabled && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    disabled && "text-gray-400 cursor-not-allowed dark:text-gray-600",
    className
  );

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};
