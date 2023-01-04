import { Prisma } from "@prisma/client";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { traineeSchema } from "@/features/trainee/trainee";

import { protectedProcedure, router } from "../trpc";

export const traineeRouter = router({
  getByAuthUserId: protectedProcedure
    .input(
      z.object({
        authUserId: z.string(),
      })
    )
    .output(z.union([traineeSchema, z.null()]))
    .query(async ({ input }) => {
      const traineeData = await prisma.trainee.findUnique({
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
  register: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        authUserId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.$transaction(
        async (tx) => {
          const trainee = await tx.trainee.findUnique({
            where: {
              authUserId: input.authUserId,
            },
          });

          if (trainee === null) {
            await tx.trainee.create({
              data: {
                id: ulid(),
                name: input.name,
                image: input.image,
                authUserId: input.authUserId,
              },
            });
          }
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    }),
});
