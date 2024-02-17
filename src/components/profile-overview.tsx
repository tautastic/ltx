import { Input } from "~/components/ui/input";
import { ChevronDown, MoreVertical, PlusIcon, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { TagSelectDropdown } from "~/components/tag-select-dropdown";
import useWindowSize from "~/lib/hooks/use-window-size";
import CreateTagDialog from "~/components/create-tag-dialog";
import { type PageWithTags, type User } from "~/schemas";
import api from "~/utils/api";
import { DocumentCard } from "~/components/document-card";
import { useFuzzy } from "~/lib/hooks/use-fuzzy";

interface ProfileOverviewProps {
  basicUser: User;
}

export const ProfileOverview = ({ basicUser }: ProfileOverviewProps) => {
  const [sortBy, setSortBy] = useState("activity");
  const { isMobile } = useWindowSize();
  const allTags = api.tags.getTagListByAuthorId.useQuery(basicUser.id).data ?? [];
  const allPages = api.pages.getAllPagesByAuthorId.useQuery(basicUser.id).data ?? [];
  const [filteredPages, setFilteredPages] = useState<PageWithTags[]>(allPages);

  const [selectedTagsId, setSelectedTagsId] = useState<string[]>([]);

  const isInSelectedTags = useCallback(
    (page: PageWithTags) =>
      selectedTagsId.length < 1 ||
      selectedTagsId.every((tagId) => page.tags.some((tag) => tag.id === tagId)),
    [selectedTagsId]
  );

  const sortFunction = useCallback(
    (a: PageWithTags, b: PageWithTags) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return b.updatedAt.getTime() - a.updatedAt.getTime();
    },
    [sortBy]
  );

  const { result, searchTerm, setSearchTerm } = useFuzzy<PageWithTags>(allPages, {
    keys: ["title", "description", "updatedAt"],
    shouldSort: true,
    ignoreFieldNorm: true,
  });

  useEffect(() => {
    setFilteredPages(result.filter(isInSelectedTags).toSorted(sortFunction));

    return () => setFilteredPages([]);
  }, [result, sortFunction, sortBy, isInSelectedTags]);

  const tagSelectDropdown = (
    <TagSelectDropdown
      tags={allTags}
      checked={(tagId: string) => selectedTagsId.includes(tagId)}
      onCheckedChange={(tagId: string) => (checked: boolean) => {
        if (checked) {
          setSelectedTagsId([...selectedTagsId, tagId]);
        } else {
          setSelectedTagsId(selectedTagsId.filter((id) => id !== tagId));
        }
      }}
    />
  );

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col space-y-6 p-1 sm:p-3">
      <div className="flex w-full flex-row justify-center space-x-3">
        <Input
          containerClassName="flex-1"
          placeholder="Search Documents..."
          onChange={(e) => setSearchTerm(e.target.value)}
          Prefix={
            <div className="px-3">
              <Search className="h-4 w-4" />
            </div>
          }
          Suffix={
            isMobile && (
              <CreateTagDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-full px-3">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="bg-gray-50 text-center dark:bg-gray-900">
                        Sort by
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                        <DropdownMenuRadioItem value="activity">
                          Sort by activity
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="name">Sort by name</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="min-w-[150px]">
                      {tagSelectDropdown}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CreateTagDialog>
            )
          }
        ></Input>
        {!isMobile && (
          <>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger asChild>
                <Button
                  className="w-[170px] justify-between"
                  Type="secondary"
                  Suffix={<ChevronDown className="h-4 w-4" />}
                >
                  <SelectValue />
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Sort by activity</SelectItem>
                <SelectItem value="name">Sort by name</SelectItem>
              </SelectContent>
            </Select>
            <CreateTagDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button Type="secondary" Suffix={<ChevronDown className="h-4 w-4" />}>
                    Select Tags
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[150px]">
                  {tagSelectDropdown}
                </DropdownMenuContent>
              </DropdownMenu>
            </CreateTagDialog>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isMobile ? (
              <Button className="px-3">
                <PlusIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button Suffix={<ChevronDown className="h-4 w-4" />}>Add New...</Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/create">
              <DropdownMenuItem>
                <span>Document</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem disabled>More coming soon...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex w-full flex-row flex-wrap justify-around gap-x-6 gap-y-4">
        {filteredPages && filteredPages.length > 0 ? (
          filteredPages.map((page) => {
            return <DocumentCard key={page.id} basicUser={basicUser} page={page} />;
          })
        ) : (
          <div className="my-auto flex h-[200px] w-full flex-col flex-wrap items-center justify-center gap-y-3">
            <h2 className="text-lg md:text-xl">No Results Found</h2>
            <br />
            <p className="text-gray-600 dark:text-gray-500">
              Your search for &quot;{searchTerm}&quot; did not return any results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
