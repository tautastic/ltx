import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Tag, TagList } from "~/schemas/TagSchema";
import { CreateNewTagSchema, TagListSchema, TagSchema } from "~/schemas/TagSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getTagListByAuthorId: publicProcedure
    .input(TagSchema.shape.authorId)
    .query<TagList>(async ({ ctx, input: authorId }) => {
      const tagList = await ctx.prisma.tag.findMany({ take: 10, where: { authorId } });

      return TagListSchema.parse(tagList);
    }),

  createNewTag: protectedProcedure.input(CreateNewTagSchema).mutation<Tag>(async ({ ctx, input }) => {
    try {
      const tag = await ctx.prisma.tag.create({
        data: {
          authorId: ctx.session.user.id,
          ...input,
        },
      });

      return TagSchema.parse(tag);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A tag with this name already exists!",
          });
        }
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error creating tag!",
      });
    }
  }),

  deleteTagById: protectedProcedure.input(TagSchema.shape.id).mutation(async ({ ctx, input }) => {
    await ctx.prisma.tag.delete({
      where: {
        id: input,
        authorId: ctx.session.user.id,
      },
    });
  }),
});
