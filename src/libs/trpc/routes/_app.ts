import { initTRPC } from "@trpc/server";
import { z } from "zod";

import client from "@/libs/prisma/client";

import { traineeSchema } from "@/features/trainee/trainee";

const { router, procedure } = initTRPC.create();

export const appRouter = router({
  getUser: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
      })
    )
    .query(async ({ input }) => {
      const userData = await client.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!userData?.id || !userData.name || !userData.image) {
        // TODO: trpcのエラーハンドリング調べる
        throw new Error();
      }

      return {
        id: userData.id,
        name: userData.name,
        image: userData.image,
      };
    }),
  getTrainee: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(z.union([traineeSchema, z.null()]))
    .query(async ({ input }) => {
      const traineeData = await client.trainee.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!traineeData?.id || !traineeData.name || !traineeData.image) {
        return null;
      }

      return {
        id: traineeData.id,
        name: traineeData.name,
        image: traineeData.image,
      };
    }),
  registerTrainee: procedure
    .input(traineeSchema)
    .mutation(async ({ input }) => {
      await client.$transaction(async () => {
        const trainee = await client.trainee.findUnique({
          where: {
            id: input.id,
          },
        });

        if (trainee === null) {
          await client.trainee.create({
            data: {
              id: input.id,
              name: input.name,
              image: input.image,
            },
          });
        }
      });
    }),
});

export type AppRouter = typeof appRouter;
