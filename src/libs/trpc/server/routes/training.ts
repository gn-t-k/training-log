import { z } from "zod";

import { registerTrainingCommand } from "@/libs/prisma/commands/register-training-command";
import { getMonthlyTrainingsQuery } from "@/libs/prisma/queries/get-monthly-trainings-query";

import { trainingSchema } from "@/features/training/training";

import { getMonthlyTrainingsResolver } from "../resolvers/get-monthly-trainings-resolver/get-monthly-trainings-resolver";
import { registerTrainingResolver } from "../resolvers/register-training-resolver/register-training-resolver";
import { initializedProcedure, router } from "../trpc";

export const trainingRouter = router({
  register: initializedProcedure
    .input(trainingSchema.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      await registerTrainingResolver({
        registerTrainingCommand,
      })({
        traineeId: ctx.trainee.id,
        todaysDate: input.createdAt,
        exercises: input.exercises.map((exercise) => ({
          exercise: exercise.exercise,
          sets: exercise.sets,
        })),
      });
    }),
  getMonthlyTrainings: initializedProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .output(z.array(trainingSchema))
    .query(async ({ input, ctx }) => {
      const trainings = await getMonthlyTrainingsResolver({
        getMonthlyTrainingsQuery,
      })({
        year: input.year,
        month: input.month,
        traineeId: ctx.trainee.id,
      });

      return trainings;
    }),
});
