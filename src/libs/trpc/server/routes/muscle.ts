import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { muscleSchema } from "@/features/muscle/muscle";

import { initializedProcedure, router } from "../trpc";

export const muscleRouter = router({
  register: initializedProcedure
    .input(muscleSchema.omit({ id: true }))
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const traineeId = ctx.trainee.id;

      const registered = await prisma.muscle.create({
        data: {
          id: ulid(),
          name: input.name,
          traineeId,
        },
      });

      return {
        id: registered.id,
        name: registered.name,
      };
    }),
  getAll: initializedProcedure
    .output(z.array(muscleSchema))
    .query(async ({ ctx }) => {
      const musclesData = await prisma.muscle.findMany({
        where: {
          traineeId: ctx.trainee.id,
        },
      });

      return musclesData.map((muscle) => ({
        id: muscle.id,
        name: muscle.name,
      }));
    }),
  getByName: initializedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(z.union([muscleSchema, z.null()]))
    .query(async ({ input, ctx }) => {
      const muscleData = await prisma.muscle.findUnique({
        where: {
          name_traineeId: {
            name: input.name,
            traineeId: ctx.trainee.id,
          },
        },
      });

      return muscleData ? { id: muscleData.id, name: muscleData.name } : null;
    }),
  updateName: initializedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const muscle = await prisma.muscle.findUnique({
        where: {
          id: input.id,
        },
      });

      if (
        muscle === null ||
        (muscle !== null && muscle.traineeId !== ctx.trainee.id)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const updated = await prisma.muscle.update({
        where: {
          id: muscle.id,
        },
        data: {
          name: input.name,
        },
      });

      return {
        id: updated.id,
        name: updated.name,
      };
    }),
  delete: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const muscle = await prisma.muscle.findUnique({
        where: {
          id: input.id,
        },
      });

      if (
        muscle === null ||
        (muscle !== null && muscle.traineeId !== ctx.trainee.id)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const deleted = await prisma.muscle.delete({
        where: {
          id: muscle.id,
        },
      });

      return {
        id: deleted.id,
        name: deleted.name,
      };
    }),
});
