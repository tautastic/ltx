import { type PageWithTags, type TagList } from "~/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Edit, MoreHorizontal, TagIcon, Trash } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SparkyStars } from "~/components/ui/sparky-stars";
import api from "~/utils/api";
import { toast } from "~/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export interface DocumentCardProps {
  page: PageWithTags;
}

const CardTags = ({ tags }: { tags: TagList }) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      {tags &&
        tags.length > 0 &&
        tags.map((tag) => (
          <Badge
            className="select-none border-transparent bg-gray-900 p-1 hover:bg-gray-800 hover:text-gray-50 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-900 dark:hover:text-gray-50"
            key={tag.id}
          >
            <label htmlFor={tag.id} className="flex flex-1 scale-90 items-center gap-x-1.5">
              <TagIcon textRendering={"geometricPrecision"} className="h-4 w-4" color={tag.color} />
              <p className="break-keep">{tag.name}</p>
            </label>
          </Badge>
        ))}
    </div>
  );
};

export const DocumentCard = ({ page }: DocumentCardProps) => {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const deletePageById = api.pages.deletePageById.useMutation();
  const userIsAuthor = session?.user.id === page.authorId;

  const handleDeletePage = async (id: string) => {
    await deletePageById.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ stale: true });
        toast({
          title: "Deleted page successfully.",
        });
      },
      onError: () => {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error deleting page.",
        });
      },
    });
  };

  return (
    <Card className="flex min-w-[325px] max-w-[650px] flex-1 flex-col justify-between">
      <Link href={`/d/${page.id}`}>
        <CardHeader>
          <CardTitle className="line-clamp-2 leading-7">{page.title}</CardTitle>
          <CardDescription className="line-clamp-4 h-[80px]">{page.description}</CardDescription>
        </CardHeader>
      </Link>
      <CardContent className="py-0">
        <CardTags tags={page.tags} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <AlertDialog>
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[170px]">
                <DropdownMenuItem className="group flex justify-between">
                  Add Favorite <SparkyStars />
                </DropdownMenuItem>
                {userIsAuthor && (
                  <>
                    <DropdownMenuItem className="flex justify-between">
                      Edit <Edit className="h-4 w-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <AlertDialogTrigger
                        type="button"
                        title="Delete page"
                        className="flex h-full w-full justify-between"
                      >
                        Delete <Trash className="h-4 w-4" />
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {userIsAuthor && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel Size="sm">Cancel</AlertDialogCancel>
                <AlertDialogAction Size="sm" onClick={() => handleDeletePage(page.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
