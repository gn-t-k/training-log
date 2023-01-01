import * as trpcNext from "@trpc/server/adapters/next";

import { appRouter } from "@/libs/trpc/routes/_app";

const handler = trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
export default handler;
