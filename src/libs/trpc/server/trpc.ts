import { initTRPC, TRPCError } from "@trpc/server";

import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const router = t.router;

const isAuthenticated = middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
