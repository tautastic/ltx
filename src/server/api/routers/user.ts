import { type User, UserSchema } from "~/schemas";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getBasicFieldsByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<User>(async ({ ctx, input: username }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username },
      });

      if (user) {
        const sessionUserIsProfileOwner = ctx.session && ctx.session.user.id === user.id;

        if (!user.isPrivate || sessionUserIsProfileOwner) {
          return UserSchema.parse(user);
        }
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),
});
