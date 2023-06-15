import { z } from "zod";

import { exerciseSchema } from "@/_features/exercise/exercise";
import { trainingSchema } from "@/_features/training/training";
import { deleteTrainingCommand } from "@/_libs/prisma/commands/delete-training-command";
import { registerTrainingCommand } from "@/_libs/prisma/commands/register-training-command";
import { updateTrainingCommand } from "@/_libs/prisma/commands/update-training-command";
import { getMonthlyTrainingDatesQuery } from "@/_libs/prisma/queries/get-monthly-training-dates-query";
import { getMonthlyTrainingsQuery } from "@/_libs/prisma/queries/get-monthly-trainings-query";
import { getTrainingByIdQuery } from "@/_libs/prisma/queries/get-training-by-id-query";
import { getTrainingsByDateQuery } from "@/_libs/prisma/queries/get-trainings-by-date-query";
import { getWeeklyTrainingDatesQuery } from "@/_libs/prisma/queries/get-weekly-training-dates-query";
import { monthSchema, yearSchema } from "@/_utils/date";


import { deleteTrainingResolver } from "../resolvers/delete-training-resolver/delete-training-resolver";
import { getMonthlyTrainingDatesResolver } from "../resolvers/get-monthly-training-dates-resolver/get-monthly-training-dates-resolver";
import { getMonthlyTrainingsResolver } from "../resolvers/get-monthly-trainings-resolver/get-monthly-trainings-resolver";
import { getTrainingByIdResolver } from "../resolvers/get-training-by-id-resolver/get-training-by-id-resolver";
import { getTrainingsByDateResolver } from "../resolvers/get-trainings-by-date-resolver/get-trainings-by-date-resolver";
import { getWeeklyTrainingDatesResolver } from "../resolvers/get-weekly-training-dates-resolver/get-weekly-training-dates-resolver";
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
      memo: z.string(),
    })
  ),
  createdAt: z.date(),
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
      memo: z.string(),
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
        records: input.records,
        createdAt: input.createdAt,
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });
    }),
  getById: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(trainingSchema)
    .query(async ({ input, ctx }) => {
      const training = await getTrainingByIdResolver({
        getTrainingByIdQuery,
      })({
        id: input.id,
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });

      return training;
    }),
  getByDate: initializedProcedure
    .input(
      z.object({
        date: z.date(),
      })
    )
    .output(z.array(trainingSchema))
    .query(async ({ input, ctx }) => {
      const trainings = await getTrainingsByDateResolver({
        getTrainingsByDateQuery,
      })({
        date: input.date,
        traineeId: ctx.trainee.id,
      });

      return trainings;
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
  getWeeklyTrainingDates: initializedProcedure
    .input(
      z.object({
        start: z.date(),
      })
    )
    .output(z.array(z.date()))
    .query(async ({ input, ctx }) => {
      const trainingDates = await getWeeklyTrainingDatesResolver({
        getWeeklyTrainingDatesQuery,
      })({
        start: input.start,
        traineeId: ctx.trainee.id,
      });

      return trainingDates;
    }),
  getMonthlyTrainingDates: initializedProcedure
    .input(
      z.object({
        year: yearSchema,
        month: monthSchema,
      })
    )
    .output(z.array(z.date()))
    .query(async ({ input, ctx }) => {
      const trainingDates = await getMonthlyTrainingDatesResolver({
        getMonthlyTrainingDatesQuery,
      })({
        year: input.year,
        month: input.month,
        traineeId: ctx.trainee.id,
      });

      return trainingDates;
    }),
  update: initializedProcedure
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
  delete: initializedProcedure
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
