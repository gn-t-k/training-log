import { z } from "zod";

import client from "@/libs/prisma/client";

import { protectedProcedure, router } from "../trpc";

export const muscleRouter = router({
  getByName: protectedProcedure
    .input(
      z.object({
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
      const muscle = await client.muscle.findUnique({
        where: {
          name: input.name,
        },
      });

      return muscle ? { id: muscle.id, name: muscle.name } : null;
    }),
});
