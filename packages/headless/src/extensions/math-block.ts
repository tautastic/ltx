import { Node } from "@tiptap/core";
import {
  addMathNodeAttributes,
  addMathNodeInputRules,
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
  parseHTML: parseMathNodeHTML({ isDisplay: true }),
  renderHTML: renderMathNodeHTML({ isDisplay: true }),
  addNodeView: () => addMathNodeView({ isDisplay: true }),
  addInputRules() {
    return addMathNodeInputRules({ nodeType: this.type, isDisplay: true });
  },
});

export default MathBlock;
