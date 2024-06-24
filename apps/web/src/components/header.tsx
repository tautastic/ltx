import { Ltx } from "~/components/ui/brand-icons";
import useScroll from "~/lib/hooks/use-scroll";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { cn } from "~/utils/cn";
import Link from "next/link";

export interface HeaderProps {
  children?: ReactNode;
  scrollThreshhold?: number;
}

const Header = ({ children, scrollThreshhold = 25 }: HeaderProps) => {
  const scrolled = useScroll(scrollThreshhold);
  const onHome = useRouter().asPath === "/";
  const ignoreScrolled = scrollThreshhold < 1;

  return (
    <header
      className={cn(
        "sticky top-0 z-10 h-[64px] w-full border-b px-4 py-2 md:py-3",
        scrolled || ignoreScrolled
          ? "border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-black/50"
          : "border-transparent bg-white dark:bg-black",
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
        {children}
      </nav>
    </header>
  );
};

export default Header;
