import type { User, UserList, UserWithFollowers } from "~/schemas/UserSchema";
import { useFuzzy } from "~/lib/hooks/use-fuzzy";
import { useEffect, useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { ProfileCard } from "~/components/profile-card";

interface ProfilePeopleProps {
  userWithFollowers: UserWithFollowers;
}

export const ProfilePeople = ({ userWithFollowers }: ProfilePeopleProps) => {
  const [filteredFollowers, setFilteredFollowers] = useState<UserList>([]);

  const allFollowers = useMemo(() => {
    const { following, followedBy } = userWithFollowers;
    if (following && followedBy) {
      return following.concat(followedBy.filter((u1) => following.findIndex((u2) => u1.id === u2.id) === -1));
    }
    return [];
  }, [userWithFollowers]);

  const { result, searchTerm, setSearchTerm } = useFuzzy<User>(allFollowers, {
    keys: ["username"],
    shouldSort: true,
    ignoreFieldNorm: true,
  });

  useEffect(() => {
    setFilteredFollowers(result);

    return () => setFilteredFollowers([]);
  }, [result]);

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col space-y-6 p-1 sm:p-3">
      <>
        <div className="flex w-full flex-row justify-center space-x-3">
          <Input
            containerClassName="flex-1"
            placeholder="Search People..."
            onChange={(e) => setSearchTerm(e.target.value)}
            Prefix={
              <div className="px-3">
                <Search className="h-4 w-4" />
              </div>
            }
          />
        </div>
        <div className="flex w-full flex-row flex-wrap justify-around gap-x-6 gap-y-4">
          {filteredFollowers && filteredFollowers.length > 0 ? (
            filteredFollowers.map((follower) => {
              return (
                <ProfileCard
                  key={follower.id}
                  isFollowed={userWithFollowers.following.includes(follower)}
                  isFollowing={userWithFollowers.followedBy.includes(follower)}
                  profileCardUser={follower}
                  profileOverviewUser={userWithFollowers}
                />
              );
            })
          ) : (
            <div className="my-auto flex h-[200px] w-full flex-col flex-wrap items-center justify-center gap-y-2">
              <h2 className="text-lg md:text-xl">No Results Found</h2>
              <br />
              {searchTerm ? (
                <p className="text-gray-600 dark:text-gray-500">
                  Your search for &quot;{searchTerm}&quot; did not return any results.
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-500">Your search did not return any results.</p>
              )}
            </div>
          )}
        </div>
      </>
    </div>
  );
};
