import { cva, type VariantProps } from "class-variance-authority";
import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react";
import { Loader } from "lucide-react";

import { cn } from "~/utils/cn";

const inputVariants = cva(
  "order-1 inline-flex flex-grow items-center justify-center rounded border px-3 py-0 text-sm focus:outline-none focus:ring-0",
  {
    variants: {
      Loading: {
        true: "disabled:cursor-wait",
        false: "transition duration-100 ease-in-out disabled:cursor-not-allowed",
      },
      Size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12 text-base",
      },
      Type: {
        primary:
          "border-gray-100 bg-white dark:bg-gray-950 focus:border-gray-600 dark:border-gray-800 dark:focus:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-700 disabled:border-gray-200 disabled:bg-gray-100/30 disabled:text-gray-400 dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-800",
      },
    },
    defaultVariants: {
      Loading: false,
      Size: "default",
      Type: "primary",
    },
  },
);

const peerVariants = cva(
  "relative flex shrink-0 items-center border border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900",
  {
    variants: {
      Size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      Size: "default",
    },
  },
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  Prefix?: ReactNode;
  Suffix?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, Loading, Prefix, Size, Suffix, Type, ...props }, ref) => {
    return (
      <div className={cn("flex items-center text-sm", containerClassName)}>
        <input
          autoCapitalize="none"
          aria-invalid="false"
          autoComplete="off"
          spellCheck="false"
          autoCorrect="off"
          className={cn(
            inputVariants({ className, Loading, Size, Type }),
            { "rounded-l-none": Prefix },
            { "rounded-r-none": Suffix },
          )}
          disabled={Loading || props.disabled}
          ref={ref}
          {...props}
        />
        {Prefix && (
          <span className={cn(peerVariants({ Size }), "order-first rounded-l border-r-0")}>
            {Loading ? <Loader className="h-4 w-4 animate-spin" /> : Prefix}
          </span>
        )}
        {Suffix && <span className={cn(peerVariants({ Size }), "order-last rounded-r border-l-0")}>{Suffix}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
