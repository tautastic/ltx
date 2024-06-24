"use client";
import { useState } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  EditorCommandList,
  EditorBubble,
} from "ltx-editor";
import type { JSONContent } from "ltx-editor";
import { ImageResizer, handleCommandNavigation } from "ltx-editor/extensions";
import { defaultExtensions } from "./extensions";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { handleImageDrop, handleImagePaste } from "ltx-editor/plugins";
import { uploadFn } from "./image-upload";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/cn";
import { EditorHeader } from "~/components/editor/EditorHeader";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  isHeaderVisible?: boolean;
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
  className?: string;
}
const Editor = ({ isHeaderVisible = false, initialValue, onChange, className }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  return (
    <EditorRoot>
      <div className="relative flex flex-1 flex-col">
        <EditorContent
          {...(initialValue && { initialContent: initialValue })}
          className="relative flex flex-1 flex-col"
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              id: "tiptap-editor",
              class: cn(
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
                className,
              ),
            },
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getJSON());
          }}
          slotBefore={isHeaderVisible && <EditorHeader />}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-[1001] select-none h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-100 bg-white text-black shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-black dark:text-white">
            <EditorCommandEmpty className="px-2 text-gray-600 dark:text-gray-400">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={
                    "flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm aria-selected:bg-gray-100 dark:aria-selected:bg-gray-900"
                  }
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </div>
    </EditorRoot>
  );
};

export default Editor;
