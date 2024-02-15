import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  CreateNewPageSchema,
  type Page,
  PageSchema,
  type PageWithTagsList,
  PageWithTagsListSchema,
} from "~/schemas";

export const pageRouter = createTRPCRouter({
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
});
