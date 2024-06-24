import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  BasicPageSchema,
  CreateNewPageSchema,
  PageListSchema,
  PageSchema,
  UpdatePageSchema,
} from "~/schemas/BasicPageSchema";
import type { BasicPage, Page, PageList } from "~/schemas/BasicPageSchema";
import { TRPCError } from "@trpc/server";

export const pageRouter = createTRPCRouter({
  getPageById: publicProcedure.input(PageSchema.shape.id).query<Page>(async ({ ctx, input }) => {
    const page = await ctx.prisma.page.findUnique({
      where: {
        id: input,
        author: {
          is: {
            OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
          },
        },
      },
      include: {
        author: true,
        starredBy: {
          where: {
            OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
          },
        },
        tags: true,
      },
    });

    if (page) {
      const sessionUserIsAuthor = ctx.session && ctx.session.user.id === page.authorId;

      if ((!page.isPrivate && !page.author.isPrivate) || sessionUserIsAuthor) {
        return PageSchema.parse(page);
      }
    }

    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }),

  getAllPagesByAuthorId: publicProcedure
    .input(BasicPageSchema.shape.authorId)
    .query<PageList>(async ({ ctx, input }) => {
      const publicPages = await ctx.prisma.page.findMany({
        where: {
          authorId: input,
          isPrivate: false,
          author: {
            is: {
              OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
            },
          },
        },
        include: {
          author: true,
          starredBy: {
            where: {
              OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
            },
          },
          tags: true,
        },
      });

      if (ctx.session?.user.id === input) {
        const privatePages = await ctx.prisma.page.findMany({
          where: {
            authorId: input,
            isPrivate: true,
            author: {
              is: {
                OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
              },
            },
          },
          include: {
            author: true,
            starredBy: {
              where: {
                OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
              },
            },
            tags: true,
          },
        });

        const allPages = publicPages.concat(privatePages);

        return PageListSchema.parse(allPages);
      }

      return PageListSchema.parse(publicPages);
    }),

  getStarredPagesByAuthorId: publicProcedure
    .input(BasicPageSchema.shape.authorId)
    .query<PageList>(async ({ ctx, input }) => {
      const starredPages = await ctx.prisma.page.findMany({
        where: {
          author: {
            is: {
              OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
            },
          },
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
    const page = await ctx.prisma.page.update({
      where: {
        authorId: ctx.session.user.id,
        id: input.pageId,
      },
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

  starPageById: protectedProcedure.input(BasicPageSchema.shape.id).mutation<BasicPage>(async ({ ctx, input }) => {
    const page = await ctx.prisma.page.update({
      where: {
        id: input,
      },
      data: {
        starredBy: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    });

    return BasicPageSchema.parse(page);
  }),

  unstarPageById: protectedProcedure.input(BasicPageSchema.shape.id).mutation<BasicPage>(async ({ ctx, input }) => {
    const page = await ctx.prisma.page.update({
      where: {
        id: input,
      },
      data: {
        starredBy: {
          disconnect: {
            id: ctx.session.user.id,
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
      },
    });
  }),
});
