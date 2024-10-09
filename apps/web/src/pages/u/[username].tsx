import { useQueryClient } from "@tanstack/react-query";
import { Book, Star, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useCallback } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { ProfileOverview } from "~/components/profile-overview";
import { ProfilePeopleWrapper } from "~/components/profile-people";
import { ProfileStars } from "~/components/profile-stars";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import api from "~/utils/api";

const FollowButton = memo<{ profileUserId: string; isFollowed: boolean }>(({ profileUserId, isFollowed }) => {
  const queryClient = useQueryClient();
  const { data, status } = useSession();
  const sessionUserId = data?.user?.id;
  const canFollow = status === "authenticated" && sessionUserId !== profileUserId;
  const followUserById = api.users.followUserById.useMutation();
  const unfollowUserById = api.users.unfollowUserById.useMutation();

  const handleToggleFollowUser = useCallback(async () => {
    if (isFollowed) {
      await unfollowUserById.mutateAsync(profileUserId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ stale: true });
        },
      });
    } else {
      await followUserById.mutateAsync(profileUserId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ stale: true });
        },
      });
    }
  }, [followUserById, unfollowUserById, isFollowed, profileUserId, queryClient.invalidateQueries]);

  if (!canFollow) {
    return null;
  }

  if (isFollowed) {
    return (
      <Button
        className="mt-4 px-6"
        Type="secondary"
        Prefix={<UserRoundMinus className="h-4 w-4" />}
        onClick={handleToggleFollowUser}
      >
        Unfollow
      </Button>
    );
  }

  return (
    <Button className="mt-4 px-6" Prefix={<UserRoundPlus className="h-4 w-4" />} onClick={handleToggleFollowUser}>
      Follow
    </Button>
  );
});

const ProfilePageWrapper = memo<{ username: string }>(({ username }) => {
  const { data: basicUser } = api.users.getBasicFieldsByUsername.useQuery(username);

  if (!basicUser) {
    return null;
  }

  return (
    <Tabs defaultValue="overview" className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-col items-center space-y-12 border-b border-gray-100 bg-gray-50 pt-12 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-y-1">
          <Avatar className="mb-2 h-32 w-32">
            {basicUser.image && (
              <Image
                src={basicUser.image}
                alt={"Profile picture"}
                width={128}
                height={128}
                quality={100}
                priority={true}
              />
            )}
          </Avatar>
          <h1 className="text-2xl font-semibold">{basicUser.name}</h1>
          <p className="text-xs font-light text-gray-400">{basicUser.username}</p>
          <FollowButton profileUserId={basicUser.id} isFollowed={basicUser.isFollowed} />
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
        <ProfileOverview profileUserId={basicUser.id} />
      </TabsContent>
      <TabsContent value="people">
        <ProfilePeopleWrapper username={basicUser.username} />
      </TabsContent>
      <TabsContent value="stars">
        <ProfileStars userId={basicUser.id} />
      </TabsContent>
    </Tabs>
  );
});

const ProfilePage: NextPageWithAuthAndLayout = () => {
  const username = useRouter().query.username;

  if (typeof username !== "string") {
    return null;
  }

  return <ProfilePageWrapper username={username} />;
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
