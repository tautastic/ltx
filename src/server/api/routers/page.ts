import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateNewPageSchema,
  type Page,
  PageSchema,
  type PageWithTags,
  type PageWithTagsList,
  PageWithTagsListSchema,
  PageWithTagsSchema,
  UpdatePageSchema,
} from "~/schemas";
import { TRPCError } from "@trpc/server";

export const pageRouter = createTRPCRouter({
  getPageById: publicProcedure
    .input(PageSchema.shape.id)
    .query<PageWithTags>(async ({ ctx, input }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input,
        },
        include: {
          tags: true,
        },
      });

      if (page) {
        const sessionUserIsAuthor = ctx.session && ctx.session.user.id === page.authorId;

        if (!page.isPrivate || sessionUserIsAuthor) {
          return PageWithTagsSchema.parse(page);
        }
      }

      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }),
  getAllPagesByAuthorId: publicProcedure
    .input(PageSchema.shape.authorId)
    .query<PageWithTagsList>(async ({ ctx, input }) => {
      const publicPages = await ctx.prisma.page.findMany({
        where: {
          authorId: input,
          isPrivate: false,
        },
        include: {
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
            tags: true,
          },
        });

        const allPages = publicPages.concat(privatePages);

        return PageWithTagsListSchema.parse(allPages);
      }

      return PageWithTagsListSchema.parse(publicPages);
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

  deletePageById: protectedProcedure.input(PageSchema.shape.id).mutation(async ({ ctx, input }) => {
    await ctx.prisma.page.delete({
      where: {
        id: input,
      },
    });
  }),
});
