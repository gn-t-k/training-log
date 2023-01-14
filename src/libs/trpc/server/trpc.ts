import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import prisma from "@/libs/prisma/client";

import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

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
      ...ctx,
      session: ctx.session,
    },
  });
});

const isInitialized = middleware(async ({ next, ctx }) => {
  if (!ctx.session?.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  if (ctx.trainee !== null) {
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        trainee: ctx.trainee,
      },
    });
  }

  const traineeData = await prisma.trainee.findUnique({
    where: {
      authUserId: ctx.session.user.id,
    },
  });

  if (traineeData === null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  const trainee = {
    id: traineeData.id,
    name: traineeData.name,
    image: traineeData.image,
  };

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      trainee,
    },
  });
});

export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(isAuthenticated);
export const initializedProcedure = t.procedure.use(isInitialized);
