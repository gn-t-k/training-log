import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { protectedProcedure, router } from "../trpc";

export const muscleRouter = router({
  getByName: protectedProcedure
    .input(
      z.object({
        traineeId: z.string(),
        name: z.string(),
      })
    )
    .output(
      z.union([
        z.object({
          id: z.string(),
          name: z.string(),
        }),
        z.null(),
      ])
    )
    .query(async ({ input }) => {
      const muscle = await prisma.muscle.findUnique({
        where: {
          name_traineeId: {
            traineeId: input.traineeId,
            name: input.name,
          },
        },
      });

      return muscle ? { id: muscle.id, name: muscle.name } : null;
    }),
});
