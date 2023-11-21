
import { createTRPCRouter } from "@/server/api/trpc";
import { formRouter } from "./routers/form";
import { answerRouter } from "./routers/answers";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  form : formRouter,
  answer : answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
