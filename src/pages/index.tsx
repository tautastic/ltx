import { Box, Star } from "lucide-react";
import AuthDropdown from "~/components/auth-dropdown";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Button } from "~/components/ui/button";
import { type NextPageWithAuthAndLayout } from "~/lib/types";

const Home: NextPageWithAuthAndLayout = () => {
  return (
    <div className="-mt-28 flex h-[500px] flex-col items-center justify-between px-6 text-center md:-mt-48 xl:h-[400px]">
      <h1 className="-mb-2 flex flex-wrap items-center justify-center overflow-hidden text-5.5xl font-extrabold tracking-[-0.04em] subpixel-antialiased xs:text-7xl md:text-7.5xl xl:flex-nowrap xl:gap-x-3 xl:text-8xl">
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
        <span data-text="Gut." className="hero-text-bg before:animate-[text-fade-bg-3_8s_infinite]">
          <span className="text-fill-transparent relative animate-[text-fade-fg-3_8s_infinite] bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28] bg-clip-text">
            Gut.
          </span>
        </span>
      </h1>
      <h2 className="w-full text-lg text-gray-600 dark:text-gray-500 sm:max-w-[560px] sm:text-xl lg:max-w-[680px] xl:scale-110 xl:text-2xl">
        <p>
          LTX is an intuitive, efficient and minimalist LaTeX editor. Creating, saving and sharing
          LaTeX documents has never been so effortless.
        </p>
      </h2>

      <div className="flex w-full flex-col justify-center gap-x-8 gap-y-6 sm:flex-row">
        <Button
          className="h-12 text-base sm:w-[200px] xl:h-[56px] xl:w-[240px] xl:text-lg"
          Prefix={<Box aria-label="Box with ring icon" className="h-5 w-5" />}
        >
          Getting started
        </Button>
        <a href="https://github.com/tautastic/ltx" target="_blank" rel="noreferrer">
          <Button
            className="h-12 w-full text-base sm:w-[200px] xl:h-[56px] xl:w-[240px] xl:text-lg"
            Type="secondary"
            Prefix={<Star aria-label="Star icon" className="h-4 w-4" />}
          >
            Star on GitHub
          </Button>
        </a>
      </div>
    </div>
  );
};

Home.auth = false;
Home.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen items-center justify-center">{page}</main>
      <Footer />
    </div>
  );
};

export default Home;