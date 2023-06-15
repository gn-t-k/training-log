import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import { getBaseUrl } from "@/_utils/get-base-url";

import type { AppRouter } from "@/_libs/trpc/server/routes/_app";


export const trpc = createTRPCNext<AppRouter>({
  config: ({ ctx: _ctx }) => {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    };
  },
  ssr: false,
});
