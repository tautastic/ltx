import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { tagRouter } from "~/server/api/routers/tag";
import { pageRouter } from "~/server/api/routers/page";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  tags: tagRouter,
  pages: pageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
