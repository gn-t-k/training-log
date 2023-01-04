import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export const createContext = async (
  opts: CreateNextContextOptions
): Promise<{ session: Session | null }> => {
  const session = await getSession({ req: opts.req });

  return {
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
