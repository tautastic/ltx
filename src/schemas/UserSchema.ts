import { z } from "zod";

import { PageSchema, TagSchema } from "~/schemas";

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.coerce.date().optional(),
  image: z.string().optional(),
  isPrivate: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export const UserProfileSchema = UserSchema.extend({
  authoredPages: z.lazy(() => PageSchema).array(),
  starredPages: z.lazy(() => PageSchema).array(),
  authoredTags: z.lazy(() => TagSchema).array(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
