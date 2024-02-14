import { type UserProfile, UserProfileSchema, UserSchema } from "~/schemas";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getExistsByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<boolean>(async ({ ctx, input: username }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username },
      });

      return Boolean(user);
    }),
  getProfileByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<UserProfile>(async ({ ctx, input: username }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username },
        include: {
          authoredPages: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              title: true,
              description: true,
              isPrivate: true,
              authorId: true,
            },
            where: {
              OR: [
                {
                  isPrivate: false,
                },
                {
                  authorId: ctx.session?.user?.id,
                },
              ],
            },
          },
          starredPages: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              title: true,
              description: true,
              isPrivate: true,
              authorId: true,
            },
            where: {
              OR: [
                {
                  isPrivate: false,
                },
                {
                  authorId: ctx.session?.user?.id,
                },
              ],
            },
          },
          authoredTags: {
            where: {
              authorId: ctx.session?.user?.id,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return UserProfileSchema.parse(user);
    }),
});
