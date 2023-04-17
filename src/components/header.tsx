import { Ltx } from "~/components/ui/brand-icons";
import useScroll from "~/lib/hooks/use-scroll";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import twcx from "~/utils/twcx";
import Link from "next/link";

const Header = (props: { children?: ReactNode }) => {
  const scrolled = useScroll(10);
  const onHome = useRouter().asPath === "/";

  return (
    <header
      className={twcx(
        "sticky top-0 z-[101] h-[64px] w-full border-b px-4 py-2 md:py-3",
        scrolled
          ? "border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-black/50"
          : "border-transparent bg-white dark:bg-black"
      )}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-x-4">
        {onHome ? (
          <Ltx className="h-[22px] w-auto cursor-pointer md:h-[28px]" width={56} />
        ) : (
          <Link aria-label="Go to LTX homepage" title="Go to LTX homepage" href="/">
            <Ltx className="h-[22px] w-auto md:h-[28px]" width={56} />
          </Link>
        )}
        {props.children}
      </nav>
    </header>
  );
};

export default Header;
