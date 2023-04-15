import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { MilkdownProvider } from "@milkdown/react";
import compose from "~/utils/compose";

const Provider = compose(MilkdownProvider, ProsemirrorAdapterProvider);

export default Provider;
