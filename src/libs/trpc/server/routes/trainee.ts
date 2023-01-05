import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { traineeSchema } from "@/features/trainee/trainee";

import { protectedProcedure, router } from "../trpc";

export const traineeRouter = router({
  getBySession: protectedProcedure
    .output(z.union([traineeSchema, z.null()]))
    .query(async ({ ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        return null;
      }

      const traineeData = await prisma.trainee.findUnique({
        where: {
          authUserId,
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "PARSE_ERROR",
        });
      }

      await prisma.$transaction(
        async (tx) => {
          const trainee = await tx.trainee.findUnique({
            where: {
              authUserId,
            },
          });

          if (trainee === null) {
            await tx.trainee.create({
              data: {
                id: ulid(),
                name: input.name,
                image: input.image,
                authUserId,
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
