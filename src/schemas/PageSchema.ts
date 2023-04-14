import { z } from "zod";

export const PageSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  description: z.string().optional(),
  expression: z.string(),
  authorId: z.string(),
  isPrivate: z.boolean(),
  fontFamily: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  fontColor: z.string(),
});

export type Page = z.infer<typeof PageSchema>;

export const PageCreateOneInputSchema = z.object({
  pageArgs: z.object({
    title: z.string(),
    description: z.string().optional(),
    expression: z.string(),
    isPrivate: z.boolean(),
    fontFamily: z.string(),
    fontSize: z.string(),
    fontWeight: z.string(),
    fontColor: z.string(),
  }),
  selectedTagIds: z.string().cuid().array(),
});
