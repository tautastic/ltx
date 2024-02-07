import { useCallback, useState } from "react";

export type SidebarState = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
};

export const useSidebar = (): SidebarState => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    close,
    isOpen,
    open,
    toggle,
  };
};
