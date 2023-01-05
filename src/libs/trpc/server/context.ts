import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import prisma from "@/libs/prisma/client";

import { Trainee } from "@/features/trainee/trainee";

export const createContext = async (
  opts: CreateNextContextOptions
): Promise<{ session: Session | null; trainee: Trainee | null }> => {
  const session = await getSession({ req: opts.req });
  const authUserId = session?.user.id ?? null;

  if (authUserId === null) {
    return {
      session,
      trainee: null,
    };
  }

  const traineeData = await prisma.trainee.findUnique({
    where: {
      authUserId,
    },
  });
  const trainee =
    traineeData !== null
      ? { id: traineeData.id, name: traineeData.name, image: traineeData.image }
      : null;

  return {
    session,
    trainee,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
