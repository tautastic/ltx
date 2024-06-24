import useWindowSize from "~/lib/hooks/use-window-size";
import type { UserWithFollowers } from "~/schemas/UserSchema";
import api from "~/utils/api";
import { ProfileOverviewWrapper } from "~/components/profile-overview-wrapper";

interface ProfileStarsProps {
  userWithFollowers: UserWithFollowers;
}

export const ProfileStars = ({ userWithFollowers }: ProfileStarsProps) => {
  const { isMobile } = useWindowSize();
  const { data: starredPages, status: getStarredPagesStatus } = api.pages.getStarredPagesByAuthorId.useQuery(
    userWithFollowers.id,
  );

  return <ProfileOverviewWrapper allPages={starredPages} isMobile={isMobile} pagesStatus={getStarredPagesStatus} />;
};
