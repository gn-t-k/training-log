import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

import { AppRouter } from "./routes/_app";

export const trpc = createTRPCNext<AppRouter>({
  config: ({ ctx: _ctx }) => {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return "";

  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT}`;
};
