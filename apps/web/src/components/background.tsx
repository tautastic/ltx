import useWindowSize from "~/lib/hooks/use-window-size";

const Background = () => {
  const { isDesktop } = useWindowSize();

  if (isDesktop) {
    return (
      <div className="pointer-events-none fixed flex min-h-screen w-screen justify-center px-6 pb-40 after:absolute after:top-0 after:z-[1] after:h-full after:w-full after:bg-[url('/img/grid.svg')] after:opacity-20 after:invert-[1] after:content-[''] dark:after:opacity-40 dark:after:invert-0">
        <div className="absolute top-12 z-[3] h-[75%] w-full max-w-screen-sm bg-[radial-gradient(at_30%_30%,#007cf0_0px,transparent_0%),radial-gradient(at_70%_30%,#00dfd8_0px,transparent_50%),radial-gradient(at_45%_30%,#7928ca_0px,transparent_50%),radial-gradient(at_45%_70%,#ff0080_0px,transparent_50%),radial-gradient(at_70%_30%,#ff4d4d_0px,transparent_50%),radial-gradient(at_70%_70%,#f9cb28_0px,transparent_50%)] opacity-10 blur-[100px] saturate-[150%] content-['']" />
      </div>
    );
  }

  return null;
};

export default Background;
