import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import api from "~/utils/api";
import ssr from "~/utils/ssr";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ProfileOverview } from "~/components/profile-overview";
import { Book, Star, Users } from "lucide-react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ username: string }>
) => {
  if (context.params && context.params.username) {
    const { username } = context.params;

    const basicUser = await ssr.users.getBasicFieldsByUsername.fetch(username);
    if (basicUser) {
      return {
        props: {
          trpcState: ssr.dehydrate(),
          basicUser,
        },
      };
    }
  }

  return { notFound: true };
};

const ProfilePage: NextPageWithAuthAndLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ basicUser }) => {
  return (
    <Tabs defaultValue="overview" className="flex h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center space-y-12 border-b border-gray-200 bg-gray-100 pt-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-1">
          <Avatar className="mb-2 h-32 w-32">
            <AvatarImage alt="Profile picture" src={basicUser.image} />
          </Avatar>
          <h1 className="text-2xl font-semibold">{basicUser.name}</h1>
          <p className="text-xs font-light text-gray-400">{basicUser.username}</p>
        </div>
        <TabsList>
          <TabsTrigger value="overview">
            <Book className="mx-1 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="people">
            <Users className="mx-1 h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="stars">
            <Star className="mx-1 h-4 w-4" />
            Stars
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="overview">
        <ProfileOverview />
      </TabsContent>
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
