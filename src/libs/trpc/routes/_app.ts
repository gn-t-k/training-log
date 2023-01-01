import { initTRPC } from "@trpc/server";
import { z } from "zod";

const { router, procedure } = initTRPC.create();

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;
