import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { exerciseSchema } from "@/features/exercise/exercise";

import { initializedProcedure, router } from "../trpc";

export const exerciseRouter = router({
  register: initializedProcedure
    .input(exerciseSchema.omit({ id: true }))
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const isValidTargets = await (async (): Promise<boolean> => {
        const musclesData = await prisma.muscle.findMany({
          where: {
            OR: input.targets.map((target) => ({ id: target.id })),
          },
        });

        return musclesData.length === input.targets.length;
      })();

      if (!isValidTargets) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      const registered = await prisma.exercise.create({
        data: {
          id: ulid(),
          name: input.name,
          targets: {
            connect: input.targets.map((target) => ({ id: target.id })),
          },
          traineeId: ctx.trainee.id,
        },
        include: {
          targets: true,
        },
      });

      return registered;
    }),
  getAll: initializedProcedure
    .output(z.array(exerciseSchema))
    .query(async ({ ctx }) => {
      const exercisesData = await prisma.exercise.findMany({
        where: {
          traineeId: ctx.trainee.id,
        },
        include: {
          targets: true,
        },
      });

      return exercisesData.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        targets: exercise.targets.map((target) => ({
          id: target.id,
          name: target.name,
        })),
      }));
    }),
  updateName: initializedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const exercise = await prisma.exercise.findUnique({
        where: {
          id: input.id,
        },
      });

      if (
        exercise === null ||
        (exercise !== null && exercise.traineeId !== ctx.trainee.id)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const updated = await prisma.exercise.update({
        where: {
          id: exercise.id,
        },
        data: {
          name: input.name,
        },
        include: {
          targets: true,
        },
      });

      return updated;
    }),
  updateTargets: initializedProcedure
    .input(
      z
        .object({
          id: z.string(),
        })
        .and(exerciseSchema.pick({ targets: true }))
    )
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const currentExerciseData = await prisma.exercise.findUnique({
        where: {
          id: input.id,
        },
        include: {
          targets: true,
        },
      });

      if (
        currentExerciseData === null ||
        (currentExerciseData !== null &&
          currentExerciseData.traineeId !== ctx.trainee.id)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const musclesData = await prisma.muscle.findMany({
        where: {
          id: { in: input.targets.map((target) => target.id) },
        },
      });
      const isValidTargets = musclesData.length === input.targets.length;

      if (!isValidTargets) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      const updated = await prisma.$transaction(async (tx) => {
        const deleted = await tx.exercise.update({
          where: {
            id: currentExerciseData.id,
          },
          data: {
            targets: {
              disconnect: currentExerciseData.targets.map((muscle) => ({
                id: muscle.id,
              })),
            },
          },
          include: {
            targets: true,
          },
        });

        if (deleted.targets.length !== 0) {
          throw new Error("更新処理に失敗しました");
        }

        const updated = await tx.exercise.update({
          where: {
            id: currentExerciseData.id,
          },
          data: {
            targets: {
              connect: input.targets.map((target) => ({ id: target.id })),
            },
          },
          include: {
            targets: true,
          },
        });

        return updated;
      });

      return updated;
    }),
  delete: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const exercise = await prisma.exercise.findUnique({
        where: {
          id: input.id,
        },
      });

      if (
        exercise === null ||
        (exercise !== null && exercise.traineeId !== ctx.trainee.id)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const deleted = await prisma.exercise.delete({
        where: {
          id: exercise.id,
        },
        include: {
          targets: true,
        },
      });

      return deleted;
    }),
});
