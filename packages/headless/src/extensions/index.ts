import { InputRule } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import TiptapUnderline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import CharacterCount from "@tiptap/extension-character-count";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Youtube from "@tiptap/extension-youtube";

import CustomKeymap from "./custom-keymap";
import ImageResizer from "./image-resizer";
import MathInline from "./math-inline";
import Placeholder from "./placeholder";
import HorizontalRule from "./horizontal-rule";

const SimpleExtensions = [
  CharacterCount.configure({ limit: 50000 }),
  CustomKeymap,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  TextStyle,
  TiptapUnderline,
] as const;

export * from "./slash-command";
export {
  CodeBlockLowlight,
  HorizontalRule,
  ImageResizer,
  InputRule,
  MathInline,
  Placeholder,
  SimpleExtensions,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapLink,
  Youtube,
};
