import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import ssr from "~/utils/ssr";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ProfileOverview } from "~/components/profile-overview";
import { Book, Star, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";
import { ProfileStars } from "~/components/profile-stars";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import api from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "~/components/ui/use-toast";
import { useCallback, useMemo } from "react";
import { ProfilePeople } from "~/components/profile-people";

export const getServerSideProps = async (context: GetServerSidePropsContext<{ username: string }>) => {
  if (context.params && context.params.username) {
    const { username } = context.params;
    context.res.setHeader("Cache-Control", "private, no-cache, max-age=0, must-revalidate");

    try {
      const basicUser = await ssr.users.getBasicFieldsByUsername.fetch(username);
      if (basicUser) {
        return {
          props: {
            trpcState: ssr.dehydrate(),
            basicUser,
          },
        };
      }
    } catch (e) {
      return { notFound: true };
    }
  }

  return { notFound: true };
};

const ProfilePage: NextPageWithAuthAndLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  basicUser,
}) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const { data: userWithFollowers } = api.users.getUserAndFollowersByUsername.useQuery(basicUser.username);

  const canFollowOrUnfollow = status === "authenticated" && session?.user.id !== basicUser.id;
  const userIsFollowed =
    session && userWithFollowers ? userWithFollowers.followedBy.map((u) => u.id).includes(session.user.id) : false;

  const followUserByIdMutation = api.users.followUserById.useMutation();
  const unfollowUserByIdMutation = api.users.unfollowUserById.useMutation();

  const handleToggleFollowUser = useCallback(
    async (id: string) => {
      if (userIsFollowed) {
        await unfollowUserByIdMutation.mutateAsync(id, {
          onSuccess: () => {
            queryClient.invalidateQueries();
            toast({
              title: "🎉 Wuhuu",
              description: "Unfollowed user successfully.",
            });
          },
          onError: () => {
            toast({
              title: "🚨 Uh oh! Something went wrong.",
              description: "Error unfollowing user.",
            });
          },
        });
      } else {
        await followUserByIdMutation.mutateAsync(id, {
          onSuccess: () => {
            queryClient.invalidateQueries();
            toast({
              title: "🎉 Wuhuu",
              description: "User followed successfully.",
            });
          },
          onError: () => {
            toast({
              title: "🚨 Uh oh! Something went wrong.",
              description: "Error following user.",
            });
          },
        });
      }
    },
    [followUserByIdMutation, queryClient, toast, unfollowUserByIdMutation, userIsFollowed],
  );

  const FollowAndUnfollowButton = useMemo(() => {
    if (!canFollowOrUnfollow || !userWithFollowers) {
      return null;
    }

    if (userIsFollowed) {
      return (
        <Button
          className="mt-4 px-6"
          Type="secondary"
          Prefix={<UserRoundMinus className="h-4 w-4" />}
          onClick={() => handleToggleFollowUser(userWithFollowers.id)}
        >
          Unfollow
        </Button>
      );
    }

    return (
      <Button
        className="mt-4 px-6"
        Prefix={<UserRoundPlus className="h-4 w-4" />}
        onClick={() => handleToggleFollowUser(userWithFollowers.id)}
      >
        Follow
      </Button>
    );
  }, [canFollowOrUnfollow, handleToggleFollowUser, userIsFollowed, userWithFollowers]);

  if (!userWithFollowers) {
    return null;
  }

  return (
    <Tabs defaultValue="overview" className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center space-y-12 border-b border-gray-100 bg-gray-50 pt-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-y-1">
          <Avatar className="mb-2 h-32 w-32">
            <AvatarImage alt="Profile picture" src={userWithFollowers.image} />
          </Avatar>
          <h1 className="text-2xl font-semibold">{userWithFollowers.name}</h1>
          <p className="text-xs font-light text-gray-400">{userWithFollowers.username}</p>
          {FollowAndUnfollowButton}
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
        <ProfileOverview userWithFollowers={userWithFollowers} />
      </TabsContent>
      <TabsContent value="people">
        <ProfilePeople userWithFollowers={userWithFollowers} />
      </TabsContent>
      <TabsContent value="stars">
        <ProfileStars userWithFollowers={userWithFollowers} />
      </TabsContent>
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
      <main className="flex min-h-screen flex-col items-center justify-start gap-y-16 pb-24 invert-0 md:gap-y-14">
        {page}
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
