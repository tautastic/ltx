import { Node } from "@tiptap/core";
import { NodeSelection } from "@tiptap/pm/state";
import {
  addMathNodeAttributes,
  addMathNodeInputRules,
  addMathNodePasteRules,
  addMathNodeStorage,
  addMathNodeView,
  parseMathNodeHTML,
  renderMathNodeHTML,
} from "../utils/math-node-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathInline: {
      toggleMathInline: () => ReturnType;
    };
  }
}

const MathInline = Node.create({
  name: "MathInline",
  group: "inline",
  content: "text*",
  atom: true,
  code: true,
  inline: true,
  addAttributes: addMathNodeAttributes,
  parseHTML: parseMathNodeHTML,
  renderHTML: renderMathNodeHTML,
  addStorage: () => addMathNodeStorage({ isDisplay: false }),
  addNodeView: () => addMathNodeView({ isDisplay: false }),
  addInputRules() {
    return addMathNodeInputRules({ nodeType: this.type, isDisplay: false });
  },
  addPasteRules() {
    return addMathNodePasteRules({ nodeType: this.type, isDisplay: false });
  },

  addCommands() {
    return {
      toggleMathInline:
        () =>
        ({ commands, state, dispatch }) => {
          if (!dispatch) {
            return false;
          }
          const { selection, tr } = state;

          if (selection.$from.node().type === this.type) {
            commands.clearNodes();
          } else {
            const node = this.type.create({ latex: "" });
            tr.replaceSelectionWith(node);
            tr.setSelection(new NodeSelection(tr.doc.resolve(selection.from)));
            dispatch(tr);
          }

          return true;
        },
    };
  },
});

export default MathInline;
