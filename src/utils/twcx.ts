import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const twcx = (...args: ClassValue[]) => {
  return twMerge(clsx(...args));
};

export default twcx;
