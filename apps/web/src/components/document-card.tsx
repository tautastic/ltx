import { useQueryClient } from "@tanstack/react-query";
import { Edit, FileDown, LinkIcon, MoreHorizontal, StarOff, TagIcon, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";
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
import { Badge } from "~/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SparkyStars } from "~/components/ui/sparky-stars";
import { useToast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import useClipboard from "~/lib/hooks/use-clipboard";
import type { Page } from "~/schemas/BasicPageSchema";
import type { TagList } from "~/schemas/TagSchema";
import api from "~/utils/api";

export interface DocumentCardProps {
  page: Page;
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
  const { toast } = useToast();
  const deletePageById = api.pages.deletePageById.useMutation();
  const starPageById = api.pages.starPageById.useMutation();
  const unstarPageById = api.pages.unstarPageById.useMutation();
  const pageIsStarred = session ? page.starredBy.map((u) => u.id).includes(session.user.id) : false;
  const userIsAuthor = session?.user.id === page.authorId;
  const documentUri = `/d/${page.id}`;
  const documentUrl = `${env.NEXT_PUBLIC_BASE_URL}${documentUri}`;
  const authorUri = `/u/${page.author.username}`;
  const { copyToClipboard: copyDocumentUrl } = useClipboard({
    onError: () =>
      toast({
        title: "🚨 Uh oh! Something went wrong.",
        description: "Could not copy link.",
      }),
    onSuccess: () =>
      toast({
        title: "🎉 Wuhuu",
        description: "Link copied successfully.",
      }),
    value: documentUrl,
  });

  const handleToggleStarPage = useCallback(async () => {
    if (pageIsStarred) {
      await unstarPageById.mutateAsync(page.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ stale: true });
          toast({
            title: "🎉 Wuhuu",
            description: "Removed page from favorites successfully.",
          });
        },
        onError: () => {
          toast({
            title: "🚨 Uh oh! Something went wrong.",
            description: "Error removing page from favorites.",
          });
        },
      });
    } else {
      await starPageById.mutateAsync(page.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ stale: true });
          toast({
            title: "🎉 Wuhuu",
            description: "Added page to favorites successfully.",
          });
        },
        onError: () => {
          toast({
            title: "🚨 Uh oh! Something went wrong.",
            description: "Error adding page from favorites.",
          });
        },
      });
    }
  }, [
    page.id,
    pageIsStarred,
    queryClient.invalidateQueries,
    toast,
    starPageById.mutateAsync,
    unstarPageById.mutateAsync,
  ]);

  const handleDeletePage = useCallback(async () => {
    await deletePageById.mutateAsync(page.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ stale: true });
        toast({
          title: "🎉 Wuhuu",
          description: "Deleted page successfully.",
        });
      },
      onError: () => {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error deleting page.",
        });
      },
    });
  }, [page.id, deletePageById.mutateAsync, queryClient.invalidateQueries, toast]);

  return (
    <Card className="flex min-w-[325px] max-w-[650px] flex-1 flex-col">
      <CardHeader className="flex flex-col gap-y-2 flex-1">
        <Link href={authorUri}>
          <CardDescription className="font-mono text-xs">{authorUri}</CardDescription>
        </Link>
        <Link href={documentUri} className="flex flex-col gap-y-1 flex-1">
          <CardTitle className="line-clamp-2 leading-7">{page.title}</CardTitle>
          <CardDescription className="line-clamp-4 h-[60px]">{page.description}</CardDescription>
        </Link>
      </CardHeader>
      <CardFooter className="flex justify-between items-stretch">
        <CardTags tags={page.tags} />
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[190px]">
              <DropdownMenuItem className="group flex justify-between" onClick={copyDocumentUrl}>
                Copy Link <LinkIcon className="h-4 w-4" />
              </DropdownMenuItem>
              <Link
                target="_blank"
                href={{
                  pathname: documentUri,
                  query: {
                    print: "pdf",
                  },
                }}
              >
                <DropdownMenuItem className="group flex justify-between">
                  Export as PDF <FileDown className="h-4 w-4" />
                </DropdownMenuItem>
              </Link>
              {status === "authenticated" && (
                <>
                  <DropdownMenuItem className="group flex justify-between" onClick={handleToggleStarPage}>
                    {pageIsStarred ? (
                      <>
                        Remove Favorite
                        <StarOff className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Add Favorite <SparkyStars />
                      </>
                    )}
                  </DropdownMenuItem>
                  {userIsAuthor && (
                    <>
                      <Link href={`/edit/${page.id}`}>
                        <DropdownMenuItem className="flex justify-between">
                          Edit <Edit className="h-4 w-4" />
                        </DropdownMenuItem>
                      </Link>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
                <AlertDialogAction Size="sm" onClick={handleDeletePage}>
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
