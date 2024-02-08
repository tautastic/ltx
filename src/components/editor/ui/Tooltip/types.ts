import type React from "react";
import { type Placement, type Props } from "tippy.js";

export interface TooltipProps {
  children?: string | React.ReactNode;
  content?: React.ReactNode;
  enabled?: boolean;
  shortcut?: string[];
  tippyOptions?: Omit<Partial<Props>, "content">;
  title?: string;
}

export interface TippyProps {
  "data-escaped"?: string;
  "data-placement": Placement;
  "data-reference-hidden"?: string;
}
