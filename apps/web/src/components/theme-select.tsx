import { useTheme } from "next-themes";

export const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-8 items-stretch rounded border border-gray-100 dark:border-gray-800">
      <label
        id="themeSelectLabel"
        for={"themeSelect"}
        className="flex select-none items-center space-x-1 whitespace-nowrap rounded-l rounded-r-none border-r border-gray-100 bg-gray-50 px-2.5 text-[14px] font-semibold dark:border-gray-800 dark:bg-gray-950"
      >
        <span>Theme</span>
      </label>
      <select
        id="themeSelect"
        aria-labelledby={"themeSelectLabel"}
        className="h-auto w-full cursor-pointer rounded border-0 bg-white px-3 py-0 text-[14px] text-gray-700 !ring-0 dark:bg-black dark:text-gray-300"
        defaultValue={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};
