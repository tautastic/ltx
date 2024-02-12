import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { CreateNewTagSchema, type Tag, type TagList, TagListSchema, TagSchema } from "~/schemas";

export const tagRouter = createTRPCRouter({
  getTagListByAuthorId: publicProcedure
    .input(TagSchema.shape.authorId)
    .query<TagList>(async ({ ctx, input: authorId }) => {
      const tagList = await ctx.prisma.tag.findMany({ where: { authorId } });

      return TagListSchema.parse(tagList);
    }),

  createNewTag: protectedProcedure
    .input(CreateNewTagSchema)
    .mutation<Tag>(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.create({
        data: {
          authorId: ctx.session.user.id,
          ...input,
        },
      });

      return TagSchema.parse(tag);
    }),

  deleteTagById: protectedProcedure.input(TagSchema.shape.id).mutation(async ({ ctx, input }) => {
    await ctx.prisma.tag.delete({
      where: {
        id: input,
      },
    });
  }),
});
