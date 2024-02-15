import { type PageWithTags, type TagList, type User } from "~/schemas";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TagIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";

export interface DocumentCardProps {
  basicUser: User;
  page: PageWithTags;
}

const CardTags = ({ tags }: { tags: TagList }) => {
  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      {tags &&
        tags.length > 0 &&
        tags.map((tag) => (
          <Badge
            className="select-none border-transparent p-1 hover:bg-gray-900 hover:text-gray-50 dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-900 dark:hover:text-gray-50"
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

export const DocumentCard = ({ basicUser, page }: DocumentCardProps) => {
  return (
    <Card className="flex min-w-[325px] max-w-[650px] flex-1 flex-col justify-between">
      <CardHeader>
        <CardTitle className="line-clamp-2 leading-7">{page.title}</CardTitle>
        <CardDescription className="line-clamp-4 h-[80px]">{page.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTags tags={page.tags} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button Type="secondary">Edit</Button>
        <Button>Open</Button>
      </CardFooter>
    </Card>
  );
};
