import { katexOptionsCtx } from "@milkdown/plugin-math";
import { useInstance } from "@milkdown/react";
import { useNodeViewContext } from "@prosemirror-adapter/react";
import * as Tabs from "@radix-ui/react-tabs";
import katex from "katex";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

type Tab = {
  label: string;
  value: string;
};

export const MathBlock: FC = () => {
  const { node, setAttrs } = useNodeViewContext();
  const code = useMemo(() => node.attrs.value as string, [node.attrs.value]);
  const codePanel = useRef<HTMLDivElement>(null);
  const codeInput = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("output");
  const [loading, getEditor] = useInstance();
  const tabs: Tab[] = useMemo(
    () => [
      { label: "Output", value: "output" },
      { label: "Source", value: "source" },
    ],
    []
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!codePanel.current || value !== "output" || loading) return;

      try {
        katex.render(code, codePanel.current, getEditor().ctx.get(katexOptionsCtx.key));
      } catch (e) {
        console.error(e);
      }
    });
  }, [code, getEditor, loading, value]);

  return (
    <Tabs.Root
      contentEditable={false}
      className="-my-2"
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    >
      <Tabs.List className="group-aria-readonly/editor:hidden">
        <div className="-mb-px flex flex-wrap">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 ${
                value === tab.value
                  ? "border-gray-800 text-black dark:border-gray-200 dark:text-white"
                  : "hover:border-gray-600 hover:text-gray-900 dark:hover:border-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </div>
      </Tabs.List>
      <Tabs.Content value="output">
        <div className="py-3 text-center" ref={codePanel} />
      </Tabs.Content>
      <Tabs.Content value="source" className="relative">
        <textarea
          className="block h-48 w-full bg-gray-800 font-mono text-sm text-gray-50 focus:outline-0 focus:ring-0 dark:bg-gray-950"
          ref={codeInput}
          spellCheck={false}
          translate={"no"}
          defaultValue={code}
        />
        <Button
          className="absolute -right-2 bottom-full inline-flex scale-[80%] items-center justify-center px-6 py-2 text-base font-medium sm:-right-1 sm:mb-0.5 sm:scale-90"
          onClick={() => {
            setAttrs({ value: codeInput.current?.value || "" });
            setValue("output");
          }}
        >
          Ok
        </Button>
      </Tabs.Content>
    </Tabs.Root>
  );
};
