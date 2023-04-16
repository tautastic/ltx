import { forwardRef, type TextareaHTMLAttributes } from "react";
import twcx from "~/utils/twcx";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      autoCapitalize="none"
      aria-invalid="false"
      autoComplete="off"
      spellCheck="false"
      autoCorrect="off"
      className={twcx(
        "flex min-h-[2.5rem] w-full rounded border border-gray-100 bg-transparent px-3 py-2 text-sm transition-colors duration-100 ease-in-out placeholder:text-gray-300 focus:border-gray-600 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:resize-none disabled:border-gray-200 disabled:bg-gray-100/30 disabled:text-gray-400 dark:border-gray-800 dark:placeholder:text-gray-800 dark:focus:border-gray-500 dark:disabled:border-gray-800 dark:disabled:bg-gray-900 dark:disabled:text-gray-800",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
