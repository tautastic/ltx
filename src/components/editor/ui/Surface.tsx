import { cn } from "~/utils/cn";
import { type HTMLProps, forwardRef } from "react";

export type SurfaceProps = HTMLProps<HTMLDivElement> & {
  withBorder?: boolean;
  withShadow?: boolean;
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, className, withShadow = true, withBorder = true, ...props }, ref) => {
    const surfaceClass = cn(
      className,
      "bg-white rounded-lg dark:bg-black",
      withShadow ? "shadow-sm" : "",
      withBorder ? "border border-gray-200 dark:border-gray-800" : ""
    );

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";
