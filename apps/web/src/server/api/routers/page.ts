import { TRPCError } from "@trpc/server";
import {
  BasicPageSchema,
  CreateNewPageSchema,
  PageListSchema,
  PageSchema,
  UpdatePageSchema,
} from "~/schemas/BasicPageSchema";
import type { BasicPage, Page, PageList } from "~/schemas/BasicPageSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const pageRouter = createTRPCRouter({
  getPageById: publicProcedure.input(PageSchema.shape.id).query<Page>(async ({ ctx, input }) => {
    const sessionUserId = ctx.session?.user.id ?? "";
    const page = await ctx.prisma.page.findUnique({
      where: {
        id: input,
        OR: [{ authorId: sessionUserId }, { isPrivate: false }],
      },
      include: {
        author: true,
        starredBy: true,
        tags: true,
      },
    });

    if (page != null) {
      return PageSchema.parse(page);
    }

    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }),

  getAllPagesByAuthorId: publicProcedure
    .input(BasicPageSchema.shape.authorId)
    .query<PageList>(async ({ ctx, input }) => {
      const sessionUserId = ctx.session?.user.id ?? "";

      const pages = await ctx.prisma.page.findMany({
        take: 10,
        where: {
          authorId: input,
          OR: [{ authorId: sessionUserId }, { isPrivate: false }],
        },
        include: {
          author: true,
          starredBy: true,
          tags: true,
        },
      });

      return PageListSchema.parse(pages);
    }),

  getStarredPagesByAuthorId: publicProcedure
    .input(BasicPageSchema.shape.authorId)
    .query<PageList>(async ({ ctx, input }) => {
      const sessionUserId = ctx.session?.user.id ?? "";
      const starredPages = await ctx.prisma.page.findMany({
        take: 10,
        where: {
          OR: [{ authorId: sessionUserId }, { isPrivate: false }],
          starredBy: {
            some: {
              id: input,
            },
          },
        },
        include: {
          author: true,
          starredBy: true,
          tags: true,
        },
      });

      return PageListSchema.parse(starredPages);
    }),

  createNewPage: protectedProcedure.input(CreateNewPageSchema).mutation<BasicPage>(async ({ ctx, input }) => {
    const page = await ctx.prisma.page.create({
      data: {
        authorId: ctx.session.user.id,
        ...input.pageArgs,
        tags: {
          connect: input.selectedTagIds.map((id) => {
            return { id };
          }),
        },
      },
    });

    return BasicPageSchema.parse(page);
  }),

  updatePage: protectedProcedure.input(UpdatePageSchema).mutation<BasicPage>(async ({ ctx, input }) => {
    const sessionUserId = ctx.session.user.id;
    const page = await ctx.prisma.page.update({
      where: {
        authorId: sessionUserId,
        id: input.pageId,
      },
      data: {
        authorId: sessionUserId,
        ...input.pageArgs,
        tags: {
          set: input.selectedTagIds.map((id) => {
            return { id };
          }),
        },
      },
    });

    return BasicPageSchema.parse(page);
  }),

  starPageById: protectedProcedure.input(BasicPageSchema.shape.id).mutation<BasicPage>(async ({ ctx, input }) => {
    const sessionUserId = ctx.session.user.id;
    const page = await ctx.prisma.page.update({
      where: {
        id: input,
        OR: [{ authorId: sessionUserId }, { isPrivate: false }],
      },
      data: {
        starredBy: {
          connect: {
            id: sessionUserId,
          },
        },
      },
    });

    return BasicPageSchema.parse(page);
  }),

  unstarPageById: protectedProcedure.input(BasicPageSchema.shape.id).mutation<BasicPage>(async ({ ctx, input }) => {
    const sessionUserId = ctx.session.user.id;
    const page = await ctx.prisma.page.update({
      where: {
        id: input,
        OR: [{ authorId: sessionUserId }, { isPrivate: false }],
      },
      data: {
        starredBy: {
          disconnect: {
            id: sessionUserId,
          },
        },
      },
    });

    return BasicPageSchema.parse(page);
  }),

  deletePageById: protectedProcedure.input(BasicPageSchema.shape.id).mutation(async ({ ctx, input }) => {
    await ctx.prisma.page.delete({
      where: {
        id: input,
        authorId: ctx.session.user.id,
      },
    });
  }),
});
