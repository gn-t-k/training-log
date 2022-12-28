import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import client from "@/libs/prisma/client";

import { getEnv } from "@/utils/get-env";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: getEnv().GOOGLE_CLIENT_ID,
      clientSecret: getEnv().GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(client),
});
