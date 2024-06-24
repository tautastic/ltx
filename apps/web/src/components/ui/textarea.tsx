import { cva, type VariantProps } from "class-variance-authority";
import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "~/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {}

const textareaVariants = cva(
  "flex min-h-[2.5rem] w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-0",
  {
    variants: {
      Loading: {
        true: "disabled:cursor-wait",
        false: "transition duration-100 ease-in-out disabled:cursor-not-allowed",
      },
      Type: {
        primary:
          "border-gray-100 bg-white dark:bg-gray-950 focus:border-gray-600 dark:border-gray-800 dark:focus:border-gray-500 placeholder:text-gray-400 dark:placeholder:text-gray-700 disabled:border-gray-200 disabled:bg-gray-100/30 disabled:text-gray-400 dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-800",
      },
    },
    defaultVariants: {
      Loading: false,
      Type: "primary",
    },
  },
);

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, Loading, Type, ...props }, ref) => {
  return (
    <textarea
      autoCapitalize="none"
      aria-invalid="false"
      autoComplete="off"
      spellCheck="false"
      autoCorrect="off"
      className={cn(textareaVariants({ className, Loading, Type }))}
      disabled={Loading || props.disabled}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
