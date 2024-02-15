import { z } from "zod";

import { PageSchema, TagSchema } from "~/schemas";

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional(),
  isPrivate: z.boolean(),
  isVerified: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
