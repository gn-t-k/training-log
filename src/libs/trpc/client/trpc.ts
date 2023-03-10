import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import type { AppRouter } from "@/libs/trpc/server/routes/_app";

import { getBaseUrl } from "@/utils/get-base-url";

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
