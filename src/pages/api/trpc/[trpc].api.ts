import * as trpcNext from "@trpc/server/adapters/next";

import { createContext } from "@/libs/trpc/server/context";
import { appRouter } from "@/libs/trpc/server/routes/_app";

const handler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
export default handler;
