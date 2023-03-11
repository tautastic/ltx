import ThemeSwitch from "~/components/theme-switch";
import { type NextPageWithAuthAndLayout } from "~/lib/types";

const Home: NextPageWithAuthAndLayout = () => {
  return (
    <>
      <ThemeSwitch />
      <div className="flex hidden flex-col items-center justify-center gap-y-6 text-center xl:gap-y-12">
        <h1 className="flex flex-wrap items-center justify-center font-extrabold tracking-[-0.04em] subpixel-antialiased sm:text-7xl lg:flex-nowrap lg:gap-x-3 2xl:text-8xl">
          <span
            data-text="Quadratisch."
            className="hero-text-bg before:animate-[text-fade-bg-1_8s_infinite]"
          >
            <span className="text-fill-transparent relative animate-[text-fade-fg-1_8s_infinite] bg-gradient-to-r from-[#007cf0] to-[#00dfd8] bg-clip-text">
              Quadratisch.
            </span>
          </span>
          <span
            data-text="Praktisch."
            className="hero-text-bg before:animate-[text-fade-bg-2_8s_infinite]"
          >
            <span className="text-fill-transparent relative animate-[text-fade-fg-2_8s_infinite] bg-gradient-to-r from-[#7928ca] to-[#ff0080] bg-clip-text">
              Praktisch.
            </span>
          </span>
          <span
            data-text="Gut."
            className="hero-text-bg before:animate-[text-fade-bg-3_8s_infinite]"
          >
            <span className="text-fill-transparent relative animate-[text-fade-fg-3_8s_infinite] bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28] bg-clip-text">
              Gut.
            </span>
          </span>
        </h1>
      </div>
    </>
  );
};

Home.auth = false;
Home.getLayout = (page) => page;

export default Home;
