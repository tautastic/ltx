import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "~/utils/cn";

interface ThemeSettings {
  icon: ReactNode;
  value: "system" | "dark" | "light";
}

const themeSettings: ThemeSettings[] = [
  {
    icon: <Monitor aria-hidden="true" size={16} />,
    value: "system",
  },
  {
    icon: <Moon aria-hidden="true" size={16} />,
    value: "dark",
  },
  {
    icon: <Sun aria-hidden="true" size={16} />,
    value: "light",
  },
];

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-gray relative m-0 flex h-9 w-[92px] cursor-pointer items-center justify-center rounded-full border-px border-gray-200 p-1 dark:border-gray-800 dark:bg-gray-900">
      {themeSettings.map((themeSetting) => {
        const { icon, value } = themeSetting;
        return (
          <span key={value} className="w-full">
            <input
              value={value}
              type="radio"
              id={`theme-switch-${value}-input`}
              checked={theme === value}
              className="peer sr-only"
              onChange={() => {
                setTheme(value);
              }}
            />
            <label
              title={`Switch to ${value} mode`}
              htmlFor={`theme-switch-${value}-input`}
              aria-label={`Switch to ${value} mode`}
              className={cn(
                "relative m-0 flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-none text-gray-500 hover:text-gray-800 peer-checked:text-gray-800 peer-focus:outline-none peer-focus-visible:text-gray-800 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-[1px] dark:hover:text-gray-200 dark:peer-checked:bg-gray-800 dark:peer-checked:text-gray-200 dark:peer-focus-visible:text-gray-200 dark:peer-focus-visible:ring-offset-black",
                {
                  "peer-checked:shadow-[0_1px_2px_0_rgba(0,_0,_0,_.2),_0_1px_3px_0_rgba(0,_0,_0,_.1)]":
                    value === "light",
                },
              )}
            >
              {icon}
            </label>
          </span>
        );
      })}
    </div>
  );
};

export default ThemeSwitch;
