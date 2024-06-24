import type { User, UserWithFollowers } from "~/schemas/UserSchema";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export interface ProfileCardProps {
  isFollowed?: boolean;
  isFollowing?: boolean;
  profileCardUser: User;
  profileOverviewUser: UserWithFollowers;
}

export const ProfileCard = ({
  isFollowed = false,
  isFollowing = false,
  profileCardUser,
  profileOverviewUser,
}: ProfileCardProps) => {
  const profileUri = `/u/${profileCardUser.username}`;

  const computeCardDescription = useMemo(() => {
    if (isFollowed && isFollowing) {
      return (
        <>
          <b>{profileOverviewUser.name}</b> and <b>{profileCardUser.name}</b> follow each other
        </>
      );
    }

    if (isFollowed) {
      return (
        <>
          <b>{profileOverviewUser.name}</b> follows this user
        </>
      );
    }

    if (isFollowing) {
      return (
        <>
          <b>{profileCardUser.name}</b> follows <b>{profileOverviewUser.name}</b>
        </>
      );
    }

    return null;
  }, [isFollowed, isFollowing, profileOverviewUser.name, profileCardUser.name]);

  return (
    <Card className="flex min-w-[200px] max-w-[400px] flex-1 flex-col justify-between">
      <Link href={profileUri}>
        <CardHeader className="flex flex-col items-center justify-center">
          <Avatar className="mb-2 h-20 w-20">
            <AvatarImage alt="Profile picture" src={profileCardUser.image} />
          </Avatar>
          <CardTitle className="line-clamp-1 leading-7">{profileCardUser.name}</CardTitle>
          <CardDescription className="mt-0 font-mono text-xs">{profileCardUser.username}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <p className="text-sm">{computeCardDescription}</p>
        </CardContent>
      </Link>
    </Card>
  );
};
