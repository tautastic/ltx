import { memo } from "react";
import { ProfileOverviewWrapper } from "~/components/profile-overview-wrapper";
import api from "~/utils/api";

export const ProfileOverview = memo<{ profileUserId: string }>(({ profileUserId }) => {
  const { data: allPages, status: getAllPagesStatus } = api.pages.getAllPagesByAuthorId.useQuery(profileUserId);

  return <ProfileOverviewWrapper allPages={allPages} pagesStatus={getAllPagesStatus} />;
});
