import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import api from "~/utils/api";
import ssr from "~/utils/ssr";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
    <Tabs defaultValue="overview" className="flex h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center space-y-12 border-b border-gray-200 bg-gray-950 pt-12 dark:border-gray-800">
        <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-1">
          <Avatar className="mb-2 h-32 w-32">
            <AvatarImage alt="Profile picture" src={userProfile.image} />
          </Avatar>
          <h1 className="text-2xl font-semibold">{userProfile.name}</h1>
          <p className="text-xs font-light text-gray-400">{userProfile.username}</p>
        </div>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="stars">Stars</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="overview">Overview</TabsContent>
      <TabsContent value="people">People</TabsContent>
      <TabsContent value="stars">Stars</TabsContent>
    </Tabs>
  );
};

ProfilePage.auth = false;
ProfilePage.getLayout = (page) => {
  return (
    <>
      <Header scrollThreshhold={0}>
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
