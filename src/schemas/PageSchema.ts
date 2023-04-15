import { z } from "zod";

export const PageSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  authorId: z.string(),
  isPrivate: z.boolean(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageCreateOneInputSchema = z.object({
  pageArgs: z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string(),
    isPrivate: z.boolean(),
  }),
  selectedTagIds: z.string().cuid().array(),
});
