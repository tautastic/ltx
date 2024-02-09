import { type Editor } from "@tiptap/core";

import { type icons } from "lucide-react";

export interface Group {
  commands: Command[];
  name: string;
  title: string;
}

export interface Command {
  action: (editor: Editor) => void;
  aliases?: string[];
  description: string;
  iconName: keyof typeof icons;
  label: string;
  name: string;
  shouldBeHidden?: (editor: Editor) => boolean;
}

export interface MenuListProps {
  command: (command: Command) => void;
  editor: Editor;
  items: Group[];
}
