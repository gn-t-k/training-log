import { initTRPC } from "@trpc/server";
import { z } from "zod";

import client from "@/libs/prisma/client";

import { TraineeSchema } from "@/features/trainee/trainee";

const { router, procedure } = initTRPC.create();

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .output(
      z.object({
        greeting: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  getTraineeById: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(z.promise(z.union([TraineeSchema, z.null()])))
    .query(async ({ input }) => {
      const userData = await client.user.findUnique({
        where: {
          id: input.id,
        },
      });
      // TODO: userIDでtraineeがとれなかったらtraineeを登録する

      return !userData?.id || !userData.name || !userData.image
        ? null
        : {
            id: userData.id,
            name: userData.name,
            image: userData.image,
          };
    }),
});

export type AppRouter = typeof appRouter;
