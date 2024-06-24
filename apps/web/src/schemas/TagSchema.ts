import { z } from "zod";

export const TagSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  color: z.string(),
  authorId: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;

export const TagListSchema = TagSchema.array();

export type TagList = z.infer<typeof TagListSchema>;

export const CreateNewTagSchema = z.object({
  name: z.string(),
  color: z.string(),
});
