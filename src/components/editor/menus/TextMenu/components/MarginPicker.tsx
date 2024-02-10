import { type ChangeEvent, type KeyboardEvent, useCallback, useState } from "react";
import { Input } from "~/components/ui/input";
import { DropdownButton } from "~/components/editor/ui/Dropdown";
import { Surface } from "~/components/editor/ui/Surface";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Toolbar } from "~/components/editor/ui/Toolbar";
import { Icon } from "~/components/editor/ui/Icon";

export type MarginPickerProps = {
  direction: "Horizontal" | "Vertical";
  onChange: (value: string) => void;
  value: string;
};

const marginRegex = /^(-?\d*\.?\d+)(rem|em|px|%)$/;

const MARGIN_PRESETS = [
  { label: "base", value: "" },
  { label: "0", value: "0" },
  { label: "0.5", value: "0.5rem" },
  { label: "1", value: "1rem" },
  { label: "2", value: "2rem" },
];

export const MarginPicker = ({ direction, onChange, value }: MarginPickerProps) => {
  const [inputValue, setInputValue] = useState("");

  const currentValue = MARGIN_PRESETS.find((margin) => margin.value === value);

  const selectMargin = useCallback(
    (margin: string) => () => {
      onChange(margin);
    },
    [onChange]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (marginRegex.test(inputValue)) {
        onChange(inputValue);
        setInputValue("");
      } else {
        console.error("Invalid margin format");
      }
    }
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button tooltip={`${direction} Space`} active={!!currentValue?.value}>
          <Icon
            name={direction === "Horizontal" ? "SeparatorVertical" : "SeparatorHorizontal"}
            className="h-4 w-4"
          />
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 px-2 py-4">
          {MARGIN_PRESETS.map((margin) => (
            <DropdownButton
              isActive={value === margin.value}
              onClick={selectMargin(margin.value)}
              key={`${margin.label}_${margin.value}`}
            >
              <span>{margin.label}</span>
            </DropdownButton>
          ))}
          <Input
            Size="sm"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="max-w-20 text-gray-800 dark:text-gray-200"
          />
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
