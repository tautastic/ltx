import { z } from "zod";
import { TagSchema } from "~/schemas/TagSchema";

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

export const PageWithTagsSchema = PageSchema.extend({
  tags: z.lazy(() => TagSchema).array(),
});

export type PageWithTags = z.infer<typeof PageWithTagsSchema>;

export const PageWithTagsListSchema = PageWithTagsSchema.array();

export type PageWithTagsList = z.infer<typeof PageWithTagsListSchema>;

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
