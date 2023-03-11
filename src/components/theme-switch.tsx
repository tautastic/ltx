import { useState, useEffect, type ReactNode } from "react";
import { Monitor, Moon, Sun } from "tauicons";
import { useTheme } from "next-themes";
import twcx from "~/utils/twcx";

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
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={twcx(
        "bg-gray relative m-0 flex h-9 w-[92px] cursor-pointer items-center justify-center",
        "rounded-full border-px border-gray-200 p-1 dark:border-gray-800 dark:bg-gray-900"
      )}
    >
      {themeSettings.map((themeSetting) => {
        const { icon, value } = themeSetting;
        return (
          <span key={value} className="w-full">
            <input
              value={value}
              type="radio"
              id={`theme-switch-${value}`}
              checked={theme === value}
              className="peer sr-only"
              onChange={() => {
                setTheme(value);
              }}
            />
            <label
              title={`Switch to ${value} mode`}
              htmlFor={`theme-switch-${value}`}
              aria-label={`Switch to ${value} mode`}
              className={twcx(
                "relative m-0 flex h-7 w-7 cursor-pointer items-center justify-center",
                "rounded-full bg-none text-gray-500 hover:text-gray-800 peer-checked:text-gray-800",
                "dark:hover:text-gray-200 dark:peer-checked:bg-gray-800 dark:peer-checked:text-gray-200",
                { "peer-checked:shadow-md": value === "light" }
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
