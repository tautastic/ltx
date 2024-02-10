import { DropdownButton } from "~/components/editor/ui/Dropdown";
import { Surface } from "~/components/editor/ui/Surface";
import { Toolbar } from "~/components/editor/ui/Toolbar";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { type ChangeEvent, type KeyboardEvent, useCallback, useState } from "react";
import LineHeightIcon from "~/components/editor/ui/LineHeightIcon";
import { Input } from "~/components/ui/input";

const LINE_HEIGHTS = [
  { label: "base", value: "" },
  { label: "1", value: "1rem" },
  { label: "1.25", value: "1.25rem" },
  { label: "1.75", value: "1.75rem" },
  { label: "2", value: "2rem" },
];

const lineHeightRegex = /^(-?\d*\.?\d+)(rem|em|px|%)$/;

export type LineHeightPickerProps = {
  onChange: (value: string) => void;
  value: string;
};

export const LineHeightPicker = ({ onChange, value }: LineHeightPickerProps) => {
  const [inputValue, setInputValue] = useState("");

  const currentValue = LINE_HEIGHTS.find((height) => height.value === value);

  const selectHeight = useCallback(
    (height: string) => () => {
      onChange(height);
    },
    [onChange]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (lineHeightRegex.test(inputValue)) {
        onChange(inputValue);
        setInputValue("");
      } else {
        console.error("Invalid line-height format");
      }
    }
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button tooltip="Line Height" active={!!currentValue?.value}>
          <LineHeightIcon className="h-5 w-5" />
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 px-2 py-4">
          {LINE_HEIGHTS.map((height) => (
            <DropdownButton
              isActive={value === height.value}
              onClick={selectHeight(height.value)}
              key={`${height.label}_${height.value}`}
            >
              <span>{height.label}</span>
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
