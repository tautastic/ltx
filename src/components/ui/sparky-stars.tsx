import { Star } from "lucide-react";
import { cn } from "~/utils/cn";

export const SparkyStars = () => {
  const commonClasses = "absolute h-2 w-2 fill-transparent stroke-0 transition-all duration-150";
  return (
    <div className="relative flex h-full items-center justify-between focus-visible:outline-none">
      <Star className="h-4 w-4" />
      <div className="absolute">
        <Star
          className={cn(
            "delay-0 group-hover:-translate-x-1 group-hover:-translate-y-3.5 group-hover:fill-green-500",
            commonClasses
          )}
        />
        <Star
          className={cn(
            "scale-75 delay-25 group-hover:-translate-y-3 group-hover:translate-x-3 group-hover:fill-blue-500",
            commonClasses
          )}
        />
        <Star
          className={cn(
            "scale-125 delay-50 group-hover:-translate-y-0.5 group-hover:translate-x-4 group-hover:fill-yellow-500",
            commonClasses
          )}
        />
        <Star
          className={cn(
            "scale-90 delay-75 group-hover:translate-x-1 group-hover:translate-y-1.5 group-hover:fill-red-500",
            commonClasses
          )}
        />
        <Star
          className={cn(
            "delay-100 group-hover:-translate-x-2 group-hover:fill-purple-500",
            commonClasses
          )}
        />
      </div>
    </div>
  );
};
