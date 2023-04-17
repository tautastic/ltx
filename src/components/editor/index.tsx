import EditorCore from "~/components/editor/core";
import { type FC } from "react";

const LtxEditor: FC<{
  defaultValue?: string;
  placeholder?: string;
  readOnly?: boolean;
}> = (props) => {
  return (
    <EditorCore
      defaultValue={props.defaultValue || ""}
      placeholder={props.placeholder || ""}
      readOnly={props.readOnly || false}
    />
  );
};

export default LtxEditor;
