import { InputRule } from "@tiptap/core";
import CharacterCount from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import TiptapUnderline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import HorizontalRule from "./horizontal-rule";
import ImageResizer from "./image-resizer";
import MathBlock from "./math-block";
import MathInline from "./math-inline";
import Placeholder from "./placeholder";

const SimpleExtensions = [
  CharacterCount.configure({ limit: 50000 }),
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Markdown.configure({
    html: true,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  TextStyle,
  TiptapUnderline,
] as const;

export * from "./slash-command";
export {
  HorizontalRule,
  ImageResizer,
  InputRule,
  MathBlock,
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
