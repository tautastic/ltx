import { type Editor } from "@tiptap/react";
import { useCallback } from "react";

export const useTextmenuCommands = (editor: Editor) => {
  const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
  const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
  const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);
  const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
  const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor]);
  const onCodeBlock = useCallback(() => editor.chain().focus().toggleCodeBlock().run(), [editor]);

  const onAlignLeft = useCallback(
    () => editor.chain().focus().setTextAlign("left").run(),
    [editor]
  );
  const onAlignCenter = useCallback(
    () => editor.chain().focus().setTextAlign("center").run(),
    [editor]
  );
  const onAlignRight = useCallback(
    () => editor.chain().focus().setTextAlign("right").run(),
    [editor]
  );
  const onAlignJustify = useCallback(
    () => editor.chain().focus().setTextAlign("justify").run(),
    [editor]
  );

  const onChangeColor = useCallback(
    (color: string) => editor.chain().setColor(color).run(),
    [editor]
  );
  const onClearColor = useCallback(() => editor.chain().focus().unsetColor().run(), [editor]);

  const onChangeHighlight = useCallback(
    (color: string) => editor.chain().setHighlight({ color }).run(),
    [editor]
  );
  const onClearHighlight = useCallback(
    () => editor.chain().focus().unsetHighlight().run(),
    [editor]
  );
  const onLink = useCallback(
    (url: string, inNewTab?: boolean) =>
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: inNewTab ? "_blank" : "" })
        .run(),
    [editor]
  );

  const onSetFont = useCallback(
    (font: string) => {
      if (!font || font.length === 0) {
        return editor.chain().focus().unsetFontFamily().run();
      }
      return editor.chain().focus().setFontFamily(font).run();
    },
    [editor]
  );

  const onSetLineHeight = useCallback(
    (height: string) => {
      if (!height || height.length === 0) {
        return editor.chain().focus().unsetLineHeight().run();
      }
      return editor.chain().focus().setLineHeight(height).run();
    },
    [editor]
  );

  const onSetHorizontalMargin = useCallback(
    (margin: string) => {
      if (!margin || margin.length === 0) {
        return editor.chain().focus().unsetHorizontalMargin().run();
      }
      return editor.chain().focus().setHorizontalMargin(margin).run();
    },
    [editor]
  );

  const onSetVerticalMargin = useCallback(
    (margin: string) => {
      if (!margin || margin.length === 0) {
        return editor.chain().focus().unsetVerticalMargin().run();
      }
      return editor.chain().focus().setVerticalMargin(margin).run();
    },
    [editor]
  );

  const onSetFontSize = useCallback(
    (fontSize: string) => {
      if (!fontSize || fontSize.length === 0) {
        return editor.chain().focus().unsetFontSize().run();
      }
      return editor.chain().focus().setFontSize(fontSize).run();
    },
    [editor]
  );

  return {
    onBold,
    onItalic,
    onStrike,
    onUnderline,
    onCode,
    onCodeBlock,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onAlignJustify,
    onChangeColor,
    onClearColor,
    onChangeHighlight,
    onClearHighlight,
    onSetFont,
    onSetFontSize,
    onSetLineHeight,
    onSetHorizontalMargin,
    onSetVerticalMargin,
    onLink,
  };
};
