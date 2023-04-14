import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";

export default createServerSideHelpers({
  router: appRouter,
  ctx: createInnerTRPCContext({ session: null }),
  transformer: superjson,
});
