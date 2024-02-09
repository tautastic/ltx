import { Icon } from "~/components/editor/ui/Icon";
import { Toolbar } from "~/components/editor/ui/Toolbar";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands";
import { useTextmenuStates } from "./hooks/useTextmenuStates";
import { BubbleMenu, type Editor } from "@tiptap/react";
import { memo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Surface } from "~/components/editor/ui/Surface";
import { ColorPicker } from "~/components/editor/panels";
import { FontFamilyPicker } from "./components/FontFamilyPicker";
import { FontSizePicker } from "./components/FontSizePicker";
import { useTextmenuContentTypes } from "./hooks/useTextmenuContentTypes";
import { ContentTypePicker } from "./components/ContentTypePicker";
import { EditLinkPopover } from "./components/EditLinkPopover";
import useWindowSize from "~/lib/hooks/use-window-size";
import { LineHeightPicker } from "~/components/editor/menus/TextMenu/components/LineHeightPicker";
import { MarginPicker } from "~/components/editor/menus/TextMenu/components/MarginPicker";

const MemoButton = memo(Toolbar.Button);
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoLineHeightPicker = memo(LineHeightPicker);
const MemoMarginPicker = memo(MarginPicker);
const MemoContentTypePicker = memo(ContentTypePicker);

export type TextMenuProps = {
  editor: Editor;
};

export const TextMenu = ({ editor }: TextMenuProps) => {
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);
  const blockOptions = useTextmenuContentTypes(editor);
  const { windowSize } = useWindowSize();

  const isMediumWidth = !!windowSize.width && windowSize.width < 1024;
  const isSmallWidth = !!windowSize.width && windowSize.width < 640;

  const PopoverItems = (
    <>
      <MemoButton
        tooltip="Bold"
        tooltipShortcut={["Mod", "B"]}
        onClick={commands.onBold}
        active={states.isBold}
      >
        <Icon name="Bold" />
      </MemoButton>
      <MemoButton
        tooltip="Italic"
        tooltipShortcut={["Mod", "I"]}
        onClick={commands.onItalic}
        active={states.isItalic}
      >
        <Icon name="Italic" />
      </MemoButton>
      <MemoButton
        tooltip="Underline"
        tooltipShortcut={["Mod", "U"]}
        onClick={commands.onUnderline}
        active={states.isUnderline}
      >
        <Icon name="Underline" />
      </MemoButton>
      <MemoButton
        tooltip="Strikehrough"
        tooltipShortcut={["Mod", "X"]}
        onClick={commands.onStrike}
        active={states.isStrike}
      >
        <Icon name="Strikethrough" />
      </MemoButton>
      <MemoButton
        tooltip="Code"
        tooltipShortcut={["Mod", "E"]}
        onClick={commands.onCode}
        active={states.isCode}
      >
        <Icon name="Code" />
      </MemoButton>
      <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
        <Icon name="Code2" />
      </MemoButton>
      <EditLinkPopover onSetLink={commands.onLink} />
      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
            <Icon name="Highlighter" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentHighlight}
              onChange={commands.onChangeHighlight}
              onClear={commands.onClearHighlight}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton active={!!states.currentColor} tooltip="Text color">
            <Icon name="Palette" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentColor}
              onChange={commands.onChangeColor}
              onClear={commands.onClearColor}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>
    </>
  );

  return (
    <BubbleMenu
      tippyOptions={{ popperOptions: { placement: "top-start" } }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <Toolbar.Wrapper>
        <MemoContentTypePicker options={blockOptions} />
        <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ""} />
        <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ""} />
        <Toolbar.Divider />
        <MemoMarginPicker onChange={commands.onSetMargin} value={states.currentMargin || ""} />
        <MemoLineHeightPicker
          onChange={commands.onSetLineHeight}
          value={states.currentLineHeight || ""}
        />
        <Toolbar.Divider />
        {!isMediumWidth && PopoverItems}
        <Popover.Root>
          <Popover.Trigger asChild>
            <MemoButton tooltip="More options">
              <Icon name="MoreVertical" />
            </MemoButton>
          </Popover.Trigger>
          <Popover.Content side="top" asChild>
            <Toolbar.Wrapper className={isSmallWidth ? "max-w-[15ch] overflow-x-scroll" : ""}>
              {isMediumWidth && PopoverItems}
              <MemoButton
                tooltip="Align left"
                tooltipShortcut={["Shift", "Mod", "L"]}
                onClick={commands.onAlignLeft}
                active={states.isAlignLeft}
              >
                <Icon name="AlignLeft" />
              </MemoButton>
              <MemoButton
                tooltip="Align center"
                tooltipShortcut={["Shift", "Mod", "E"]}
                onClick={commands.onAlignCenter}
                active={states.isAlignCenter}
              >
                <Icon name="AlignCenter" />
              </MemoButton>
              <MemoButton
                tooltip="Align right"
                tooltipShortcut={["Shift", "Mod", "R"]}
                onClick={commands.onAlignRight}
                active={states.isAlignRight}
              >
                <Icon name="AlignRight" />
              </MemoButton>
              <MemoButton
                tooltip="Justify"
                tooltipShortcut={["Shift", "Mod", "J"]}
                onClick={commands.onAlignJustify}
                active={states.isAlignJustify}
              >
                <Icon name="AlignJustify" />
              </MemoButton>
            </Toolbar.Wrapper>
          </Popover.Content>
        </Popover.Root>
      </Toolbar.Wrapper>
    </BubbleMenu>
  );
};
