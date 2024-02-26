import { z } from "zod";

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

export const UserListSchema = UserSchema.array();

export type UserList = z.infer<typeof UserListSchema>;

export const UserWithFollowersSchema = UserSchema.extend({
  following: z.lazy(() => UserSchema.array()),
  followedBy: z.lazy(() => UserSchema.array()),
});

export type UserWithFollowers = z.infer<typeof UserWithFollowersSchema>;
