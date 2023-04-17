import { Plugin, PluginKey } from "@milkdown/prose/state";
import type { EditorView } from "@milkdown/prose/view";
import type { MilkdownPlugin } from "@milkdown/ctx";
import { $ctx, $prose } from "@milkdown/utils";

/// Options for placeholder config.
export interface PlaceholderConfigOptions {
  placeholder: string;
}

/// A slice contains the placeholder config.
export const placeholderConfig = $ctx<PlaceholderConfigOptions, "placeholderConfig">(
  {
    placeholder: "",
  },
  "placeholderConfig"
);

placeholderConfig.meta = {
  package: "@tautastic/milkdown-plugin-placeholder",
  displayName: "Ctx<placeholderConfig>",
};

/// The prosemirror plugin for placeholder.
export const placeholderPlugin = $prose((ctx) => {
  const placeholderPluginKey = new PluginKey("MILKDOWN_PLACEHOLDER");
  const { placeholder } = ctx.get(placeholderConfig.key);
  return new Plugin({
    key: placeholderPluginKey,
    view: (view) => {
      const update = (view: EditorView) => {
        const doc = view.state.doc;
        if (
          view.editable &&
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.firstChild?.content.size === 0
        ) {
          view.dom.setAttribute("data-placeholder", placeholder);
        } else {
          view.dom.removeAttribute("data-placeholder");
        }
      };

      update(view);

      return { update };
    },
  });
});

placeholderPlugin.meta = {
  package: "@tautastic/milkdown-plugin-placeholder",
  displayName: "Prose<placeholder>",
};

/// All plugins exported by this package.
const placeholder: MilkdownPlugin[] = [placeholderPlugin, placeholderConfig];

export default placeholder;
