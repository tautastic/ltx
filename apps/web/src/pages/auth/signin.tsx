import type { AvailableProviders } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Discord, Github, Google, Spotify, Twitch } from "~/components/ui/brand-icons";
import { Button } from "~/components/ui/button";
import type { NextPageWithAuthAndLayout } from "~/lib/types";

const Signin: NextPageWithAuthAndLayout = () => {
  const [loading, setLoading] = useState({
    discord: false,
    github: false,
    google: false,
    spotify: false,
    twitch: false,
  });

  const handleSignin = (provider: AvailableProviders) => {
    setLoading((prev) => ({ ...prev, [provider]: true }));
    signIn(provider, {
      callbackUrl: "/",
    })
      .then((res) => {
        if (res?.ok) {
          setLoading((prev) => ({ ...prev, [provider]: false }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="m-auto w-full min-w-[345px] max-w-md px-4 pb-28 lg:max-w-lg">
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 px-8 py-10 dark:border-gray-800 dark:bg-gray-950 lg:p-12">
        <h1 className="text-3xl font-semibold text-gray-900 subpixel-antialiased dark:text-white lg:text-3xl">
          Sign in
        </h1>
        <p className="mb-8 mt-1 text-gray-800 subpixel-antialiased dark:text-gray-200">
          with one of the following providers
        </p>
        <div className="flex select-none flex-col gap-6 bg-gray-50 dark:bg-gray-950">
          <Button
            Type="secondary"
            className="border-gray-400 bg-white py-5 text-black dark:bg-black dark:text-white"
            Loading={loading.discord}
            onClick={() => handleSignin("discord")}
            Prefix={<Discord />}
          >
            Continue with Discord
          </Button>
          <Button
            Type="secondary"
            className="border-gray-400 bg-white py-5 text-black dark:bg-black dark:text-white"
            Loading={loading.github}
            onClick={() => handleSignin("github")}
            Prefix={<Github />}
          >
            Continue with Github
          </Button>
          <Button
            Type="secondary"
            className="border-gray-400 bg-white py-5 text-black dark:bg-black dark:text-white"
            Loading={loading.google}
            onClick={() => handleSignin("google")}
            Prefix={<Google />}
          >
            Continue with Google
          </Button>
          <Button
            Type="secondary"
            className="border-gray-400 bg-white py-5 text-black dark:bg-black dark:text-white"
            Loading={loading.spotify}
            onClick={() => handleSignin("spotify")}
            Prefix={<Spotify />}
          >
            Continue with Spotify
          </Button>
          <Button
            Type="secondary"
            className="border-gray-400 bg-white py-5 text-black dark:bg-black dark:text-white"
            Loading={loading.twitch}
            onClick={() => handleSignin("twitch")}
            Prefix={<Twitch />}
          >
            Continue with Twitch
          </Button>
        </div>
      </div>
    </div>
  );
};

Signin.auth = false;
Signin.getLayout = (page) => {
  return (
    <>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex h-screen flex-col">{page}</main>
      <Footer />
    </>
  );
};

export default Signin;
