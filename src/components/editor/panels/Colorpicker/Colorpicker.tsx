import { type ChangeEvent, useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ColorButton } from "./ColorButton";
import { Toolbar } from "../../ui/Toolbar";
import { Icon } from "../../ui/Icon";
import { themeColors } from "~/lib/types";

export type ColorPickerProps = {
  color?: string;
  hideFooter?: boolean;
  onChange?: (color: string) => void;
  onClear?: () => void;
};

export const ColorPicker = ({ color, hideFooter = false, onChange, onClear }: ColorPickerProps) => {
  const [colorInputValue, setColorInputValue] = useState(color || "");

  const handleColorUpdate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setColorInputValue(event.target.value);
  }, []);

  const handleColorChange = useCallback(() => {
    const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(colorInputValue);

    if (!isCorrectColor) {
      if (onChange) {
        onChange("");
      }

      return;
    }

    if (onChange) {
      onChange(colorInputValue);
    }
  }, [colorInputValue, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <HexColorPicker className="w-full" color={color || ""} onChange={onChange} />
      {!hideFooter && (
        <input
          type="text"
          className="w-full rounded border border-gray-200 bg-white p-2 text-black focus:outline-1 focus:outline-gray-300 focus:ring-0 dark:border-gray-800 dark:bg-black dark:text-white dark:focus:outline-gray-700"
          placeholder="#000000"
          value={colorInputValue}
          onChange={handleColorUpdate}
          onBlur={handleColorChange}
        />
      )}
      {!hideFooter && (
        <div className="flex max-w-[15rem] flex-wrap items-center gap-1">
          {themeColors.map((currentColor) => (
            <ColorButton
              active={currentColor === color}
              color={currentColor}
              key={currentColor}
              onColorChange={onChange}
            />
          ))}
          <Toolbar.Button tooltip="Reset color to default" onClick={onClear}>
            <Icon name="Undo" />
          </Toolbar.Button>
        </div>
      )}
    </div>
  );
};
