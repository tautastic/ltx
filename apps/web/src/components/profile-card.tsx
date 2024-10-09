import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Avatar } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { User, UserWithFollowers } from "~/schemas/UserSchema";

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
            {profileCardUser.image && (
              <Image src={profileCardUser.image} alt={"Profile picture"} width={128} height={128} priority={true} />
            )}
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
