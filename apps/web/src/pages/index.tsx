import type { JSONContent } from "ltx-editor";
import { Box, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import Background from "~/components/background";
import Editor from "~/components/editor/advanced-editor";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Button } from "~/components/ui/button";
import { Fieldset, FieldsetContent } from "~/components/ui/fieldset";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import { exampleLatex } from "~/lib/types";

const Home: NextPageWithAuthAndLayout = () => {
  const [value, _setValue] = useState<JSONContent>(exampleLatex);
  return (
    <>
      <div className="flex flex-col items-center justify-between gap-y-8 px-4 text-center md:gap-y-16">
        <h1 className="flex flex-wrap items-center justify-center overflow-hidden text-7xl font-extrabold subpixel-antialiased xs:text-7xl md:text-7.5xl xl:flex-nowrap xl:gap-x-3 xl:text-8xl">
          <span data-text="Write." className="hero-text-bg before:animate-[text-fade-bg-1_8s_infinite]">
            <span className="text-fill-transparent relative animate-[text-fade-fg-1_8s_infinite] bg-gradient-to-r from-[#007cf0] to-[#00dfd8] bg-clip-text">
              Write.
            </span>
          </span>
          <span data-text="Learn." className="hero-text-bg before:animate-[text-fade-bg-2_8s_infinite]">
            <span className="text-fill-transparent relative animate-[text-fade-fg-2_8s_infinite] bg-gradient-to-r from-[#7928ca] to-[#ff0080] bg-clip-text">
              Learn.
            </span>
          </span>
          <span data-text="Connect." className="hero-text-bg before:animate-[text-fade-bg-3_8s_infinite]">
            <span className="text-fill-transparent relative animate-[text-fade-fg-3_8s_infinite] bg-gradient-to-r from-[#ff4d4d] to-[#f9cb28] bg-clip-text">
              Connect.
            </span>
          </span>
        </h1>
        <h2 className="w-full text-lg text-gray-600 dark:text-gray-500 sm:max-w-[560px] sm:text-xl lg:max-w-[680px] xl:scale-110 xl:text-2xl">
          <p>
            LTX is an intuitive, efficient and minimalist LaTeX editor. Creating, saving and sharing LaTeX documents has
            never been so effortless.
          </p>
        </h2>

        <div className="flex w-full flex-col justify-center gap-x-8 gap-y-6 sm:flex-row">
          <Link href="/create">
            <Button
              className="h-12 w-full text-base sm:w-[200px] xl:h-[56px] xl:w-[240px] xl:text-lg"
              Prefix={<Box aria-label="Box with ring icon" className="h-5 w-5" />}
            >
              Getting started
            </Button>
          </Link>
          <a href="/github" target="_blank" rel="noreferrer">
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
      <Fieldset className="m-auto w-full max-w-screen-sm md:max-w-[75ch] lg:max-w-[95ch]">
        <FieldsetContent className="min-h-[800px] p-4">
          <Editor readonly={true} initialValue={value} />
        </FieldsetContent>
      </Fieldset>
    </>
  );
};

Home.auth = false;
Home.getLayout = (page) => {
  return (
    <>
      <Header>
        <AuthDropdown />
      </Header>
      <Background />
      <main className="flex min-h-screen flex-col items-center justify-start gap-y-16 px-2 py-20 invert-0 md:gap-y-14 md:py-32">
        {page}
      </main>
      <Footer />
    </>
  );
};

export default Home;
