import type React from "react";
import { type Editor as CoreEditor } from "@tiptap/core";
import { type Editor } from "@tiptap/react";
import { type EditorState } from "@tiptap/pm/state";
import { type EditorView } from "@tiptap/pm/view";

export interface MenuProps {
  appendTo?: React.RefObject<any>;
  editor: Editor;
  shouldHide?: boolean;
}

export interface ShouldShowProps {
  editor?: CoreEditor;
  from?: number;
  oldState?: EditorState;
  state?: EditorState;
  to?: number;
  view: EditorView;
}
