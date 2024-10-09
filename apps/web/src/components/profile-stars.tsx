import { ProfileOverviewWrapper } from "~/components/profile-overview-wrapper";
import api from "~/utils/api";

export const ProfileStars = ({ userId }: { userId: string }) => {
  const { data: starredPages, status: getStarredPagesStatus } = api.pages.getStarredPagesByAuthorId.useQuery(userId);

  return <ProfileOverviewWrapper allPages={starredPages} pagesStatus={getStarredPagesStatus} />;
};
