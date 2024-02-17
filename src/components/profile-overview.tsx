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
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import React, { useState } from "react";
import Link from "next/link";
import { TagSelectDropdown } from "~/components/tag-select-dropdown";
import useWindowSize from "~/lib/hooks/use-window-size";
import CreateTagDialog from "~/components/create-tag-dialog";
import { type PageWithTags, type Tag, type User } from "~/schemas";
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

  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>(
    allTags.reduce(
      (acc, tag: Tag) => {
        acc[tag.id] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const { result: filteredPages, setSearchTerm } = useFuzzy<PageWithTags>(allPages, {
    keys: ["title", "description"],
  });

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
                      <TagSelectDropdown
                        tags={allTags}
                        checked={(tagId: string) => selectedTags[tagId]}
                        onCheckedChange={(tagId: string) => (checked: boolean) =>
                          setSelectedTags({ ...selectedTags, [tagId]: checked })
                        }
                      />
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
                  <TagSelectDropdown
                    tags={allTags}
                    checked={(tagId: string) => selectedTags[tagId]}
                    onCheckedChange={(tagId: string) => (checked: boolean) =>
                      setSelectedTags({ ...selectedTags, [tagId]: checked })
                    }
                  />
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
          <span>Empty</span>
        )}
      </div>
    </div>
  );
};
