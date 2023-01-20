import { z } from "zod";

import { deleteTrainingCommand } from "@/libs/prisma/commands/delete-training-command";
import { registerTrainingCommand } from "@/libs/prisma/commands/register-training-command";
import { updateTrainingCommand } from "@/libs/prisma/commands/update-training-command";
import { getMonthlyTrainingsQuery } from "@/libs/prisma/queries/get-monthly-trainings-query";
import { getTrainingByIdQuery } from "@/libs/prisma/queries/get-training-by-id-query";

import { exerciseSchema } from "@/features/exercise/exercise";
import { trainingSchema } from "@/features/training/training";

import { deleteTrainingResolver } from "../resolvers/delete-training-resolver/delete-training-resolver";
import { getMonthlyTrainingsResolver } from "../resolvers/get-monthly-trainings-resolver/get-monthly-trainings-resolver";
import { registerTrainingResolver } from "../resolvers/register-training-resolver/register-training-resolver";
import { updateTrainingResolver } from "../resolvers/update-training-resolver/update-training-resolver";
import { initializedProcedure, router } from "../trpc";

const registerTrainingInputSchema = z.object({
  records: z.array(
    z.object({
      exercise: exerciseSchema,
      sets: z.array(
        z.object({
          weight: z.number(),
          repetition: z.number(),
        })
      ),
    })
  ),
});
export type RegisterTrainingInput = z.infer<typeof registerTrainingInputSchema>;

const updateTrainingInputSchema = z.object({
  trainingId: z.string(),
  records: z.array(
    z.object({
      exercise: exerciseSchema,
      sets: z.array(
        z.object({
          weight: z.number(),
          repetition: z.number(),
        })
      ),
    })
  ),
});
export type UpdateTrainingInput = z.infer<typeof updateTrainingInputSchema>;

export const trainingRouter = router({
  register: initializedProcedure
    .input(registerTrainingInputSchema)
    .mutation(async ({ input, ctx }) => {
      await registerTrainingResolver({
        registerTrainingCommand,
      })({
        traineeId: ctx.trainee.id,
        records: input.records,
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
  updateTraining: initializedProcedure
    .input(updateTrainingInputSchema)
    .mutation(async ({ input, ctx }) => {
      await updateTrainingResolver({
        updateTrainingCommand,
        getTrainingByIdQuery,
      })({
        traineeId: ctx.trainee.id,
        trainingId: input.trainingId,
        records: input.records,
      });
    }),
  deleteTraining: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await deleteTrainingResolver({
        getTrainingByIdQuery,
        deleteTrainingCommand,
      })({
        traineeId: ctx.trainee.id,
        trainingId: input.id,
      });
    }),
});
