import { Sparkles, Star } from "lucide-react";
import { cn } from "~/utils/cn";

export const SparkyStars = () => {
  const commonClasses = "absolute h-2.5 w-2.5 stroke-0 transition-all duration-300 ease-spring scale-0";
  return (
    <div className="relative flex h-full items-center justify-between focus-visible:outline-none">
      <Star className="h-4 w-4" />
      <div className="absolute">
        <Sparkles
          className={cn(
            "fill-green-500 delay-0 group-hover:-translate-x-1 group-hover:-translate-y-3.5 group-hover:scale-[110%]",
            commonClasses,
          )}
        />
        <Sparkles
          className={cn(
            "fill-blue-500 delay-25 group-hover:-translate-y-3 group-hover:translate-x-3 group-hover:scale-[80%]",
            commonClasses,
          )}
        />
        <Sparkles
          className={cn(
            "fill-yellow-500 delay-50 group-hover:-translate-y-0.5 group-hover:translate-x-4 group-hover:scale-125",
            commonClasses,
          )}
        />
        <Sparkles
          className={cn(
            "scale-90 fill-red-500 delay-75 group-hover:translate-x-1 group-hover:translate-y-1.5 group-hover:scale-100",
            commonClasses,
          )}
        />
        <Sparkles
          className={cn("fill-purple-500 delay-100 group-hover:-translate-x-2 group-hover:scale-100", commonClasses)}
        />
      </div>
    </div>
  );
};
