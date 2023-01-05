import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { muscleSchema } from "@/features/muscle/muscle";

import { authenticatedProcedure, initializedProcedure, router } from "../trpc";

export const muscleRouter = router({
  register: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const traineeData = await prisma.trainee.findUnique({
        where: {
          authUserId,
        },
        select: {
          id: true,
        },
      });

      if (!traineeData) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const registered = await prisma.muscle.create({
        data: {
          id: ulid(),
          name: input.name,
          traineeId: traineeData.id,
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
    .mutation(async ({ input }) => {
      const updated = await prisma.muscle.update({
        where: {
          id: input.id,
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
    .mutation(async ({ input }) => {
      const deleted = await prisma.muscle.delete({
        where: {
          id: input.id,
        },
      });

      return {
        id: deleted.id,
        name: deleted.name,
      };
    }),
});
