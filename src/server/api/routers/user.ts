import { type User, UserSchema } from "~/schemas";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getBasicFieldsByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<User>(async ({ ctx, input: username }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username },
      });

      return UserSchema.parse(user);
    }),
});
