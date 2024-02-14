import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import api from "~/utils/api";
import ssr from "~/utils/ssr";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ username: string }>
) => {
  if (context.params && context.params.username) {
    const { username } = context.params;
    // Perform user existence check
    const profileExists = await ssr.users.getExistsByUsername.fetch(username);
    if (profileExists) {
      // Only prefetch and dehydrate if the user exists
      await ssr.users.getProfileByUsername.prefetch(username);
      return {
        props: {
          trpcState: ssr.dehydrate(),
          username,
        },
      };
    }
  }

  return { notFound: true };
};

const ProfilePage: NextPageWithAuthAndLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ username }) => {
  const { data: userProfile, status } = api.users.getProfileByUsername.useQuery(username);

  if (status !== "success") {
    // won't happen since the query has been prefetched
    return <h1 className="text-3xl font-bold">Loading...</h1>;
  }

  return (
    <div className="flex w-full flex-col items-center space-y-12 bg-gray-950 pt-12">
      <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-1">
        <Avatar className="mb-2 h-32 w-32">
          <AvatarImage alt="Profile picture" src={userProfile.image} />
        </Avatar>
        <h1 className="text-2xl font-semibold">{userProfile.name}</h1>
        <p className="text-xs font-light text-gray-400">{userProfile.username}</p>
      </div>
      <div className="w-full border-b border-gray-200 dark:border-gray-800">
        <ul
          className="m-auto flex w-full max-w-xl justify-between text-center text-sm font-medium"
          id="default-tab"
          data-tabs-toggle="#default-tab-content"
          role="tablist"
        >
          <li role="presentation" className="flex-1">
            <button
              className="inline-block px-6 py-3 hover:border-gray-300 hover:text-gray-600 dark:hover:border-gray-700 dark:hover:text-gray-300"
              id="overview-tab"
              data-tabs-target="#overview"
              type="button"
              role="tab"
              aria-controls="overview"
              aria-selected="false"
            >
              Overview
            </button>
          </li>
          <li role="presentation" className="flex-1">
            <button
              className="inline-block px-6 py-3 hover:border-gray-300 hover:text-gray-600 dark:hover:border-gray-700 dark:hover:text-gray-300"
              id="people-tab"
              data-tabs-target="#people"
              type="button"
              role="tab"
              aria-controls="people"
              aria-selected="false"
            >
              People
            </button>
          </li>
          <li role="presentation" className="flex-1">
            <button
              className="inline-block px-6 py-3 hover:border-gray-300 hover:text-gray-600 dark:hover:border-gray-700 dark:hover:text-gray-300"
              id="stars-tab"
              data-tabs-target="#stars"
              type="button"
              role="tab"
              aria-controls="stars"
              aria-selected="false"
            >
              Stars
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProfilePage.auth = false;
ProfilePage.getLayout = (page) => {
  return (
    <>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start gap-y-16 pb-24 invert-0 md:gap-y-14 md:pb-32">
        {page}
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
