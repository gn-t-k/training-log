import { TRPCError } from "@trpc/server";
import { z } from "zod";

import prisma from "@/libs/prisma/client";
import { registerMuscleCommand } from "@/libs/prisma/commands/register-muscle-command";
import { getAllMusclesQuery } from "@/libs/prisma/queries/get-all-muscles-query";

import { muscleSchema } from "@/features/muscle/muscle";

import { getAllMusclesResolver } from "../resolvers/get-all-muscles-resolver/get-all-muscles-resolver";
import { registerMuscleResolver } from "../resolvers/register-muscle-resolver/register-muscle-resolver";
import { initializedProcedure, router } from "../trpc";

export const muscleRouter = router({
  register: initializedProcedure
    .input(muscleSchema.omit({ id: true }))
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const registered = await registerMuscleResolver({
        registerMuscleCommand,
      })({
        traineeId: ctx.trainee.id,
        name: input.name,
      });

      return registered;
    }),
  getAll: initializedProcedure
    .output(z.array(muscleSchema))
    .query(async ({ ctx }) => {
      const muscles = await getAllMusclesResolver({ getAllMusclesQuery })({
        traineeId: ctx.trainee.id,
      });

      return muscles;
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
