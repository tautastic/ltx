import {
  CodeBlockLowlight,
  HorizontalRule,
  MathBlock,
  MathInline,
  Placeholder,
  StarterKit,
  TaskItem,
  TaskList,
  TiptapImage,
  TiptapLink,
  Youtube,
} from "ltx-editor/extensions";
import { common, createLowlight } from "lowlight";
import { UploadImagesPlugin } from "ltx-editor/plugins";
import { cn } from "~/utils/cn";

export const defaultExtensions = [
  MathBlock,
  MathInline,
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: cn("list-disc list-outside leading-3 -mt-2"),
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: cn("list-decimal list-outside leading-3 -mt-2"),
      },
    },
    listItem: {
      HTMLAttributes: {
        class: cn("leading-normal -mb-2"),
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: cn("border-l-4 border-gray-50 dark:border-gray-900"),
      },
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class: cn("rounded-md bg-gray-100 dark:bg-gray-900 px-1.5 py-1 font-mono font-medium"),
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: false,
    gapcursor: false,
  }),
  Placeholder,
  TiptapLink.configure({
    HTMLAttributes: {
      class: cn(
        "text-gray-50 dark:text-gray-900 underline underline-offset-[3px] hover:text-white dark:text-black transition-colors cursor-pointer",
      ),
    },
  }),
  TiptapImage.extend({
    name: "tiptapImage",
    addProseMirrorPlugins() {
      return [
        UploadImagesPlugin({
          imageClass: cn("opacity-40 rounded-lg border border-gray-100 dark:border-gray-800"),
        }),
      ];
    },
  }).configure({
    allowBase64: true,
    HTMLAttributes: {
      class: cn("rounded-lg border border-gray-200 dark:border-gray-800"),
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: cn("not-prose pl-2 "),
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: cn("flex gap-2 items-start my-4"),
    },
    nested: true,
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: cn("mt-4 mb-6 border-t border-gray-200 dark:border-gray-800"),
    },
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: "javascript",
  }),
  Youtube,
];
