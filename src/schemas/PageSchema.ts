import { z } from "zod";
import { TagSchema } from "~/schemas/TagSchema";
import { UserSchema } from "~/schemas/UserSchema";

export const PageSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  authorId: z.string(),
  isPrivate: z.boolean(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageListSchema = PageSchema.array();

export type PageList = z.infer<typeof PageListSchema>;

export const PageWithStarsAndTagsSchema = PageSchema.extend({
  starredBy: z.lazy(() => UserSchema).array(),
  tags: z.lazy(() => TagSchema).array(),
});

export type PageWithStarsAndTags = z.infer<typeof PageWithStarsAndTagsSchema>;

export const PageWithStarsAndTagsListSchema = PageWithStarsAndTagsSchema.array();

export type PageWithStarsAndTagsList = z.infer<typeof PageWithStarsAndTagsListSchema>;

export const CreateNewPageSchema = z.object({
  pageArgs: z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string(),
    isPrivate: z.boolean(),
  }),
  selectedTagIds: z.string().cuid().array(),
});

export const UpdatePageSchema = CreateNewPageSchema.extend({
  pageId: z.string().cuid(),
});
