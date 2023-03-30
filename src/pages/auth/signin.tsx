import { type AvailableProviders } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { Discord, Github, Google, Spotify, Twitch } from "~/components/ui/brand-icons";
import { Button } from "~/components/ui/button";
import { type NextPageWithAuthAndLayout } from "~/lib/types";

const Signin: NextPageWithAuthAndLayout = () => {
  const [loading, setLoading] = useState({
    discord: false,
    github: false,
    google: false,
    spotify: false,
    twitch: false,
  });

  const handleSignin = async (provider: AvailableProviders) => {
    setLoading((prev) => ({ ...prev, [provider]: true }));
    // Wait 1 second to show the loading state
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await signIn(provider, {
        callbackUrl: "/",
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };
  return (
    <div className="m-auto w-full min-w-[345px] max-w-md px-4 pb-28 lg:max-w-lg">
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 px-8 py-10 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 lg:p-12">
        <h1 className="text-2xl font-semibold text-gray-900 subpixel-antialiased dark:text-white lg:text-3xl">
          Sign in
        </h1>
        <p className="mb-8 text-gray-900 subpixel-antialiased dark:text-white">
          with one of the following providers
        </p>
        <div className="flex select-none flex-col gap-6 bg-gray-50 dark:bg-gray-950">
          <Button Loading={loading.discord} onClick={(e) => handleSignin} Prefix={<Discord />}>
            Continue with Discord
          </Button>
          <Button Loading={loading.github} onClick={(e) => handleSignin} Prefix={<Github />}>
            Continue with Github
          </Button>
          <Button Loading={loading.google} onClick={(e) => handleSignin} Prefix={<Google />}>
            Continue with Google
          </Button>
          <Button Loading={loading.spotify} onClick={(e) => handleSignin} Prefix={<Spotify />}>
            Continue with Spotify
          </Button>
          <Button Loading={loading.twitch} onClick={(e) => handleSignin} Prefix={<Twitch />}>
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
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex h-screen flex-col">{page}</main>
      <Footer />
    </div>
  );
};

export default Signin;
