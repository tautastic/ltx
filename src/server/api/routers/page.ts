import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CreateNewPageSchema, type Page, PageSchema } from "~/schemas";

export const pageRouter = createTRPCRouter({
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
