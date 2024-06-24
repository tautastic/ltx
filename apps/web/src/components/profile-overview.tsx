import useWindowSize from "~/lib/hooks/use-window-size";
import type { UserWithFollowers } from "~/schemas/UserSchema";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { ProfileOverviewWrapper } from "~/components/profile-overview-wrapper";

interface ProfileOverviewProps {
  userWithFollowers: UserWithFollowers;
}

export const ProfileOverview = ({ userWithFollowers }: ProfileOverviewProps) => {
  const { isMobile } = useWindowSize();
  const { data: session } = useSession();
  const { data: allPages, status: getAllPagesStatus } = api.pages.getAllPagesByAuthorId.useQuery(userWithFollowers.id);

  return (
    <ProfileOverviewWrapper
      allPages={allPages}
      isAuthor={session?.user.id === userWithFollowers.id}
      isMobile={isMobile}
      pagesStatus={getAllPagesStatus}
    />
  );
};
