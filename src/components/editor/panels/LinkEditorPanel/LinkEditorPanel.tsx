import { Button } from "~/components/editor/ui/Button";
import { Icon } from "~/components/editor/ui/Icon";
import { Surface } from "~/components/editor/ui/Surface";
import { Toggle } from "~/components/editor/ui/Toggle";
import { useState, useCallback, useMemo, type FormEvent, type ChangeEvent } from "react";

export type LinkEditorPanelProps = {
  initialOpenInNewTab?: boolean;
  initialUrl?: string;
  onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({
  initialUrl,
  initialOpenInNewTab,
  onSetLink,
}: LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || "");
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetLink]
  );

  return {
    url,
    setUrl,
    openInNewTab,
    setOpenInNewTab,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const LinkEditorPanel = ({
  onSetLink,
  initialOpenInNewTab,
  initialUrl,
}: LinkEditorPanelProps) => {
  const state = useLinkEditorState({ onSetLink, initialOpenInNewTab, initialUrl });

  return (
    <Surface className="p-2">
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex cursor-text items-center gap-2 rounded-lg bg-gray-100 p-2 dark:bg-gray-900">
          <Icon name="Link" className="flex-none text-black dark:text-white" />
          <input
            type="url"
            className="min-w-[12rem] flex-1 bg-transparent text-sm text-black outline-none dark:text-white"
            placeholder="Enter URL"
            value={state.url}
            onChange={state.onChange}
          />
        </label>
        <Button variant="primary" buttonSize="small" type="submit" disabled={!state.isValidUrl}>
          Set Link
        </Button>
      </form>
      <div className="mt-3">
        <label className="flex cursor-pointer select-none items-center justify-start gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Open in new tab
          <Toggle active={state.openInNewTab} onChange={state.setOpenInNewTab} />
        </label>
      </div>
    </Surface>
  );
};
