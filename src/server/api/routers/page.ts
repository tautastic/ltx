import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateNewPageSchema,
  type Page,
  PageSchema,
  type PageWithStarsAndTags,
  type PageWithStarsAndTagsList,
  PageWithStarsAndTagsListSchema,
  PageWithStarsAndTagsSchema,
  UpdatePageSchema,
} from "~/schemas";
import { TRPCError } from "@trpc/server";

export const pageRouter = createTRPCRouter({
  getPageById: publicProcedure
    .input(PageSchema.shape.id)
    .query<PageWithStarsAndTags>(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input,
        },
        include: {
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

        if (!page.isPrivate || sessionUserIsAuthor) {
          return PageWithStarsAndTagsSchema.parse(page);
        }
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),
  getAllPagesByAuthorId: publicProcedure
    .input(PageSchema.shape.authorId)
    .query<PageWithStarsAndTagsList>(async ({ ctx, input }) => {
      const publicPages = await ctx.prisma.page.findMany({
        where: {
          authorId: input,
          isPrivate: false,
        },
        include: {
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
          },
          include: {
            starredBy: {
              where: {
                OR: [{ isPrivate: false }, { isPrivate: true, id: ctx.session?.user.id }],
              },
            },
            tags: true,
          },
        });

        const allPages = publicPages.concat(privatePages);

        return PageWithStarsAndTagsListSchema.parse(allPages);
      }

      return PageWithStarsAndTagsListSchema.parse(publicPages);
    }),

  createNewPage: protectedProcedure
    .input(CreateNewPageSchema)
    .mutation<Page>(async ({ ctx, input }) => {
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

      return PageSchema.parse(page);
    }),

  updatePage: protectedProcedure.input(UpdatePageSchema).mutation<Page>(async ({ ctx, input }) => {
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

    return PageSchema.parse(page);
  }),

  starPageById: protectedProcedure
    .input(PageSchema.shape.id)
    .mutation<Page>(async ({ ctx, input }) => {
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

      return PageSchema.parse(page);
    }),

  unstarPageById: protectedProcedure
    .input(PageSchema.shape.id)
    .mutation<Page>(async ({ ctx, input }) => {
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

      return PageSchema.parse(page);
    }),

  deletePageById: protectedProcedure.input(PageSchema.shape.id).mutation(async ({ ctx, input }) => {
    await ctx.prisma.page.delete({
      where: {
        id: input,
      },
    });
  }),
});
