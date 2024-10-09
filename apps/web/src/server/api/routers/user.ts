import { TRPCError } from "@trpc/server";
import { type BasicUser, BasicUserSchema, UserSchema, UserWithFollowersSchema } from "~/schemas/UserSchema";
import type { User, UserWithFollowers } from "~/schemas/UserSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getBasicFieldsByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<BasicUser>(async ({ ctx, input: username }) => {
      const sessionUserId = ctx.session?.user?.id ?? "";
      const dbUser = await ctx.prisma.user.findUnique({
        where: { username },
        include: {
          followedBy: {
            where: { id: sessionUserId },
            select: { id: true },
          },
        },
      });

      if (dbUser != null) {
        const isFollowed = dbUser.followedBy.length > 0;

        return BasicUserSchema.parse({ ...dbUser, isFollowed });
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),

  getUserAndFollowersByUsername: publicProcedure
    .input(UserSchema.shape.username)
    .query<UserWithFollowers>(async ({ ctx, input: username }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username },
        include: {
          following: true,
          followedBy: true,
        },
      });

      if (user != null) {
        return UserWithFollowersSchema.parse(user);
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),

  followUserById: protectedProcedure.input(UserSchema.shape.id).mutation<User>(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        following: {
          connect: {
            id: input,
          },
        },
      },
    });

    if (user != null) {
      return UserSchema.parse(user);
    }

    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }),

  unfollowUserById: protectedProcedure.input(UserSchema.shape.id).mutation<User>(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        following: {
          disconnect: {
            id: input,
          },
        },
      },
    });

    if (user) {
      return UserSchema.parse(user);
    }

    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }),
});
