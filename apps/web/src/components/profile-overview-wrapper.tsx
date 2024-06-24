import { Skeleton } from "~/components/ui/skeleton";
import type { Page, PageList } from "~/schemas/BasicPageSchema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFuzzy } from "~/lib/hooks/use-fuzzy";
import { TagSelectDropdown } from "~/components/tag-select-dropdown";
import { Input } from "~/components/ui/input";
import { ChevronDown, MoreVertical, PlusIcon, Search } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { DocumentCard } from "~/components/document-card";

export const ProfileOverviewWrapper = ({
  allPages,
  pagesStatus,
  ...props
}: {
  allPages?: PageList;
  isAuthor?: boolean;
  isMobile: boolean;
  pagesStatus: "error" | "success" | "loading";
}) => {
  if (allPages && pagesStatus === "success") {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col space-y-6 p-1 sm:p-3">
        <StatefulProfileOverview allPages={allPages} {...props} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col space-y-6 p-1 sm:p-3">
      <div className="flex w-full flex-row justify-center space-x-3">
        <Skeleton className="h-9 flex-1" />
        {props.isMobile ? (
          <Skeleton className="w-[170px]" />
        ) : (
          <>
            <Skeleton className="w-[170px]" />
            <Skeleton className="min-w-[130px]" />
            <Skeleton className="min-w-[130px]" />
          </>
        )}
      </div>
      <div className="flex w-full flex-row flex-wrap justify-around gap-x-6 gap-y-4">
        <Skeleton className="h-[260px] min-w-[325px] max-w-[650px] flex-1 rounded-xl" />
        <Skeleton className="h-[260px] min-w-[325px] max-w-[650px] flex-1 rounded-xl" />
        <Skeleton className="h-[260px] min-w-[325px] max-w-[650px] flex-1 rounded-xl" />
      </div>
    </div>
  );
};

const StatefulProfileOverview = ({
  allPages,
  isAuthor = false,
  isMobile,
}: {
  allPages: PageList;
  isAuthor?: boolean;
  isMobile: boolean;
}) => {
  const [sortBy, setSortBy] = useState("activity");
  const [selectedTagsId, setSelectedTagsId] = useState<string[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageList>([]);

  const allTags = useMemo(() => {
    if (allPages) {
      return allPages
        .flatMap((p) => p.tags)
        .filter((tag, index, tags) => tags.findIndex((t) => t.id === tag.id) === index);
    }
    return [];
  }, [allPages]);

  const isInSelectedTags = useCallback(
    (page: Page) =>
      selectedTagsId.length < 1 || selectedTagsId.every((tagId) => page.tags.some((tag) => tag.id === tagId)),
    [selectedTagsId],
  );

  const sortFunction = useCallback(
    (a: Page, b: Page) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    },
    [sortBy],
  );

  const { result, searchTerm, setSearchTerm } = useFuzzy<Page>(allPages, {
    keys: ["title", "description", "updatedAt"],
    shouldSort: true,
    ignoreFieldNorm: true,
  });

  useEffect(() => {
    setFilteredPages(result.filter(isInSelectedTags).toSorted(sortFunction));

    return () => setFilteredPages([]);
  }, [result, sortFunction, isInSelectedTags]);

  const tagSelectDropdown = useMemo(() => {
    return (
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
  }, [allTags, selectedTagsId]);

  return (
    <>
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
              <DropdownMenu>
                <DropdownMenuTrigger className="h-full px-3">
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="bg-gray-50 text-center dark:bg-gray-900">Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuRadioItem value="activity">Sort by activity</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">Sort by name</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup className="min-w-[150px]">{tagSelectDropdown}</DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button Type="secondary" Suffix={<ChevronDown className="h-4 w-4" />}>
                  Select Tags
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[150px]">{tagSelectDropdown}</DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
        {isAuthor && (
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
        )}
      </div>
      <div className="flex w-full flex-row flex-wrap justify-around gap-x-6 gap-y-4">
        {filteredPages && filteredPages.length > 0 ? (
          filteredPages.map((page) => {
            return <DocumentCard key={page.id} page={page} />;
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
  );
};
