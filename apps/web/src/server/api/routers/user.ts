import { UserSchema, UserWithFollowersSchema } from "~/schemas/UserSchema";
import type { User, UserWithFollowers } from "~/schemas/UserSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
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

      if (user) {
        const sessionUserIsProfileOwner = ctx.session && ctx.session.user.id === user.id;

        if (!user.isPrivate || sessionUserIsProfileOwner) {
          return UserWithFollowersSchema.parse(user);
        }
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),

  followUserById: protectedProcedure.input(UserSchema.shape.id).mutation<User>(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
        isPrivate: false,
      },
      data: {
        following: {
          connect: {
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

  unfollowUserById: protectedProcedure.input(UserSchema.shape.id).mutation<User>(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
        isPrivate: false,
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
