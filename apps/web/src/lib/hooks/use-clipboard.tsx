import { useState } from "react";
import copy from "copy-to-clipboard";

export default function useClipboard({
  onError,
  onSuccess,
  value,
}: {
  onError?: () => void;
  onSuccess?: () => void;
  value: string;
}): {
  copyToClipboard: () => void;
  isCopied: boolean;
} {
  const [isCopied, setIsCopied] = useState(false);

  return {
    copyToClipboard: () => {
      const didCopy = copy(value);
      setIsCopied(didCopy);

      if (!didCopy && onError) {
        onError();
      }

      if (didCopy && onSuccess) {
        onSuccess();
      }
    },
    isCopied,
  };
}
