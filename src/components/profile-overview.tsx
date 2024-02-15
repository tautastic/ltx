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
import { type Tag, type User } from "~/schemas";
import api from "~/utils/api";

interface ProfileOverviewProps {
  basicUser: User;
}

export const ProfileOverview = ({ basicUser }: ProfileOverviewProps) => {
  const [sortBy, setSortBy] = useState("activity");
  const { isMobile } = useWindowSize();
  const { data } = api.tags.getTagListByAuthorId.useQuery(basicUser.id);

  const tags = data ?? [];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    tags.reduce(
      (acc, tag: Tag) => {
        acc[tag.id] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  return (
    <div className="mx-auto max-w-screen-xl p-1 sm:p-3">
      <div className="flex w-full flex-row justify-center space-x-3">
        <Input
          containerClassName="flex-1"
          placeholder="Search Documents..."
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
                    <DropdownMenuGroup className="w-[150px]">
                      <TagSelectDropdown
                        tags={tags}
                        checked={(tagId: string) => checkedItems[tagId]}
                        onCheckedChange={(tagId: string) => (checked: boolean) =>
                          setCheckedItems({ ...checkedItems, [tagId]: checked })
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
                <DropdownMenuContent className="w-[150px]">
                  <TagSelectDropdown
                    tags={tags}
                    checked={(tagId: string) => checkedItems[tagId]}
                    onCheckedChange={(tagId: string) => (checked: boolean) =>
                      setCheckedItems({ ...checkedItems, [tagId]: checked })
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
    </div>
  );
};
