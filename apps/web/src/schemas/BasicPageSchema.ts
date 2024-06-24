import { z } from "zod";
import { TagSchema } from "~/schemas/TagSchema";
import { UserSchema } from "~/schemas/UserSchema";

export const BasicPageSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  authorId: z.string(),
  isPrivate: z.boolean(),
});

export type BasicPage = z.infer<typeof BasicPageSchema>;

export const BasicPageListSchema = BasicPageSchema.array();

export type BasicPageList = z.infer<typeof BasicPageListSchema>;

export const PageSchema = BasicPageSchema.extend({
  author: z.lazy(() => UserSchema),
  starredBy: z.lazy(() => UserSchema).array(),
  tags: z.lazy(() => TagSchema).array(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageListSchema = PageSchema.array();

export type PageList = z.infer<typeof PageListSchema>;

export const CreateNewPageSchema = z.object({
  pageArgs: z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string(),
    isPrivate: z.boolean(),
  }),
  selectedTagIds: z.string().cuid().array(),
});

export type CreateNewPage = z.infer<typeof CreateNewPageSchema>;

export const UpdatePageSchema = CreateNewPageSchema.extend({
  pageId: z.string().cuid(),
});
