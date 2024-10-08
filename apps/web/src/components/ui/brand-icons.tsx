import { forwardRef, type SVGAttributes } from "react";
import { cn } from "~/utils/cn";

export const Youtube = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Youtube"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
));
Youtube.displayName = "Youtube";

export const Discord = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Discord"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
));
Discord.displayName = "Discord";

export const Github = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Github"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437.55.102.75-.238.75-.53 0-.26-.009-.952-.014-1.87-3.06.664-3.706-1.475-3.706-1.475-.5-1.27-1.221-1.61-1.221-1.61-.999-.681.075-.668.075-.668 1.105.078 1.685 1.134 1.685 1.134.981 1.68 2.575 1.195 3.202.914.1-.71.384-1.195.698-1.47-2.442-.278-5.01-1.222-5.01-5.437 0-1.2.428-2.183 1.132-2.952-.114-.278-.491-1.397.108-2.91 0 0 .923-.297 3.025 1.127A10.536 10.536 0 0 1 12 6.32a10.49 10.49 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128.6 1.514.223 2.633.11 2.911.705.769 1.13 1.751 1.13 2.952 0 4.226-2.572 5.156-5.022 5.428.395.34.747 1.01.747 2.037 0 1.47-.014 2.657-.014 3.017 0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11" />
  </svg>
));
Github.displayName = "Github";

export const Google = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Google"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.99 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123-.2.6-.314 1.24-.314 1.9 0 .66.114 1.3.314 1.9.786 2.364 2.99 4.123 5.595 4.123 1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045 0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49z" />
  </svg>
));
Google.displayName = "Google";

export const Spotify = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Spotify"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M19.098 10.638C15.23 8.341 8.85 8.13 5.158 9.251a1.122 1.122 0 1 1-.652-2.148C8.745 5.816 15.79 6.064 20.244 8.708a1.122 1.122 0 1 1-1.146 1.93m-.126 3.403a.936.936 0 0 1-1.287.308c-3.225-1.983-8.142-2.557-11.958-1.399a.937.937 0 0 1-1.167-.623.937.937 0 0 1 .624-1.167c4.358-1.322 9.776-.682 13.48 1.594.44.271.578.847.308 1.287m-1.469 3.267a.748.748 0 0 1-1.028.25c-2.818-1.723-6.365-2.112-10.542-1.158a.748.748 0 1 1-.333-1.458c4.571-1.045 8.492-.595 11.655 1.338a.748.748 0 0 1 .248 1.028M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c6.628 0 12-5.372 12-12S18.628 0 12 0" />
  </svg>
));
Spotify.displayName = "Spotify";

export const Twitch = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="Twitch"
    fill="currentColor"
    viewBox="0 0 24 24"
    stroke="none"
    role={"img"}
    ref={ref}
    {...props}
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
  </svg>
));
Twitch.displayName = "Twitch";

export const Ltx = forwardRef<SVGSVGElement, SVGAttributes<SVGElement>>(({ className, ...props }, ref) => (
  <svg
    className={cn("h-6 w-6", className)}
    shapeRendering="geometricPrecision"
    aria-label="LTX"
    fill="currentColor"
    viewBox="0 0 1436 705"
    stroke="currentColor"
    strokeWidth="0"
    role={"img"}
    ref={ref}
    {...props}
  >
    <g>
      <path d="M -0.5,-0.5 C 66.5,-0.5 133.5,-0.5 200.5,-0.5C 200.5,181.5 200.5,363.5 200.5,545.5C 278.5,545.5 356.5,545.5 434.5,545.5C 434.5,598.5 434.5,651.5 434.5,704.5C 289.5,704.5 144.5,704.5 -0.5,704.5C -0.5,469.5 -0.5,234.5 -0.5,-0.5 Z" />
    </g>
    <g>
      <path d="M 364.5,-0.5 C 551.5,-0.5 738.5,-0.5 925.5,-0.5C 971.153,66.7901 1017.32,133.79 1064,200.5C 1110.35,133.789 1156.18,66.7894 1201.5,-0.5C 1274.17,-0.5 1346.83,-0.5 1419.5,-0.5C 1338.22,113.206 1256.55,226.706 1174.5,340C 1261.4,460.989 1348.4,581.822 1435.5,702.5C 1435.5,703.167 1435.5,703.833 1435.5,704.5C 1358.17,704.5 1280.83,704.5 1203.5,704.5C 1155.94,632.264 1107.94,560.264 1059.5,488.5C 1011.84,560.492 964.17,632.492 916.5,704.5C 840.167,704.5 763.833,704.5 687.5,704.5C 771.956,585.108 857.29,466.275 943.5,348C 898.798,285.43 854.464,222.596 810.5,159.5C 776.84,158.5 743.173,158.167 709.5,158.5C 709.667,287.834 709.5,417.167 709,546.5C 671.723,599.603 633.89,652.27 595.5,704.5C 566.167,704.5 536.833,704.5 507.5,704.5C 507.5,522.5 507.5,340.5 507.5,158.5C 459.833,158.5 412.167,158.5 364.5,158.5C 364.5,105.5 364.5,52.5 364.5,-0.5 Z" />
    </g>
  </svg>
));
Ltx.displayName = "Ltx";
