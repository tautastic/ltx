import PlaceholderCore from "@tiptap/extension-placeholder";

const Placeholder = PlaceholderCore.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }
    return "Press '/' for commands";
  },
  includeChildren: true,
});

export default Placeholder;
