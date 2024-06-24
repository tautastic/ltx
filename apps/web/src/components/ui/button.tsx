import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";

import { cn } from "~/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center gap-x-2 justify-center rounded border px-4 py-2 text-sm font-medium focus:outline-none disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 dark:focus:ring-offset-black dark:disabled:border-gray-800 dark:disabled:bg-gray-800/40 dark:disabled:text-gray-600",
  {
    variants: {
      Loading: {
        true: "disabled:cursor-wait",
        false: "transition ease-in-out duration-100 disabled:cursor-not-allowed",
      },
      Size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12 text-base",
      },
      Type: {
        primary: "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black",
        secondary:
          "bg-transparent text-gray-800 hover:text-black dark:border-gray-800 dark:text-gray-300 dark:hover:text-white",
        danger: "bg-red-600 border-red-600 text-white",
        warning: "bg-yellow-400 border-yellow-400 text-white",
      },
      Variant: {
        default:
          "focus-visible:ring-2 focus-visible:ring-offset-[1px] active:bg-gray-200/80 dark:active:bg-gray-800/50",
        shadow: "",
      },
    },
    compoundVariants: [
      {
        Variant: "shadow",
        Loading: false,
        class: "hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-lg active:shadow-sm",
      },
      {
        Type: "primary",
        Variant: "default",
        class:
          "hover:bg-transparent hover:text-black focus-visible:ring-black dark:hover:bg-transparent dark:hover:text-white dark:focus-visible:ring-white",
      },
      {
        Type: "secondary",
        Variant: "default",
        class: "hover:border-black focus-visible:ring-black dark:hover:border-white dark:focus-visible:ring-gray-600",
      },
      {
        Type: "danger",
        Variant: "default",
        class: "hover:bg-transparent hover:text-red-600 focus-visible:ring-red-600",
      },
      {
        Type: "warning",
        Variant: "default",
        class: "hover:bg-transparent hover:text-yellow-400 focus-visible:ring-yellow-400",
      },
    ],
    defaultVariants: {
      Loading: false,
      Size: "default",
      Type: "primary",
      Variant: "default",
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  Prefix?: ReactNode;
  Suffix?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, Loading, Prefix, Size, Suffix, Type, Variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ className, Loading, Size, Type, Variant }))}
        disabled={Loading || props.disabled}
        ref={ref}
        {...props}
      >
        {Loading ? <Loader className="h-4 w-4 animate-spin" /> : Prefix && <span className="flex">{Prefix}</span>}
        {children && <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>}
        {!Loading && Suffix && <span className="flex flex-shrink">{Suffix}</span>}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
