import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateNewPageSchema,
  type Page,
  PageSchema,
  type PageWithTagsList,
  PageWithTagsListSchema,
} from "~/schemas";
import { TRPCError } from "@trpc/server";

export const pageRouter = createTRPCRouter({
  getPageById: publicProcedure.input(PageSchema.shape.id).query<Page>(async ({ ctx, input }) => {
    const page = await ctx.prisma.page.findUnique({
      where: {
        id: input,
      },
    });

    if (page) {
      const sessionUserIsAuthor = ctx.session && ctx.session.user.id === page.authorId;

      if (!page.isPrivate || sessionUserIsAuthor) {
        return PageSchema.parse(page);
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
