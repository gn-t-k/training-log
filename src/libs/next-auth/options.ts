import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

import client from "@/libs/prisma/client";

import { getEnv } from "@/utils/get-env";

import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnv().GOOGLE_CLIENT_ID,
      clientSecret: getEnv().GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(client),
  callbacks: {
    session: async ({ session, user }) => {
      return Promise.resolve({
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      });
    },
  },
  secret: getEnv().NEXT_AUTH_SECRET,
};
