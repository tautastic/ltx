import { useState, useEffect } from "react";

const useWindowSize = () => {
  const isClient = typeof window === "object";

  const [windowSize, setWindowSize] = useState<{
    height: number | undefined;
    width: number | undefined;
  }>({
    height: undefined,
    width: undefined,
  });
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    let timeoutId: ReturnType<typeof setTimeout>;

    function handleResize() {
      setResizing(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setResizing(false);
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 300);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [isClient]);

  return {
    windowSize,
    resizing,
    isMobile: typeof windowSize?.width === "number" && windowSize?.width < 768,
    isDesktop: typeof windowSize?.width === "number" && windowSize?.width >= 768,
  };
};

export default useWindowSize;
