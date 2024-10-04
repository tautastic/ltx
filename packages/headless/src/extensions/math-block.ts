import { Node } from "@tiptap/core";
import {
  addMathNodeAttributes,
  addMathNodeInputRules,
  addMathNodePasteRules,
  addMathNodeStorage,
  addMathNodeView,
  parseMathNodeHTML,
  renderMathNodeHTML,
} from "../utils/math-node-view";

const MathBlock = Node.create({
  name: "MathBlock",
  group: "block",
  content: "text*",
  atom: true,
  inline: false,
  selectable: true,
  addAttributes: addMathNodeAttributes,
  parseHTML: parseMathNodeHTML,
  renderHTML: renderMathNodeHTML,
  addStorage: () => addMathNodeStorage({ isDisplay: true }),
  addNodeView: () => addMathNodeView({ isDisplay: true }),
  addInputRules() {
    return addMathNodeInputRules({ nodeType: this.type, isDisplay: true });
  },
  addPasteRules() {
    return addMathNodePasteRules({ nodeType: this.type, isDisplay: true });
  },
});

export default MathBlock;
