import { initTRPC } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import client from "@/libs/prisma/client";

import { traineeSchema } from "@/features/trainee/trainee";

const { router, procedure } = initTRPC.create();

export const appRouter = router({
  getTraineeByAuthUserId: procedure
    .input(
      z.object({
        authUserId: z.string(),
      })
    )
    .output(z.union([traineeSchema, z.null()]))
    .query(async ({ input }) => {
      const traineeData = await client.trainee.findUnique({
        where: {
          authUserId: input.authUserId,
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
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        authUserId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await client.$transaction(async () => {
        const trainee = await client.trainee.findUnique({
          where: {
            authUserId: input.authUserId,
          },
        });

        if (trainee === null) {
          await client.trainee.create({
            data: {
              id: ulid(),
              name: input.name,
              image: input.image,
              authUserId: input.authUserId,
            },
          });
        }
      });
    }),
});

export type AppRouter = typeof appRouter;
