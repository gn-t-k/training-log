import { z } from "zod";

import { exerciseSchema } from "@/_features/exercise/exercise";
import { recordSchema } from "@/_features/training/training";
import { deleteExerciseCommand } from "@/_libs/prisma/commands/delete-exercise-command";
import { registerExerciseCommand } from "@/_libs/prisma/commands/register-exercise-command";
import { updateExerciseNameCommand } from "@/_libs/prisma/commands/update-exercise-name-command";
import { updateExerciseTargetsCommand } from "@/_libs/prisma/commands/update-exercise-targets-command";
import { getExerciseByIdQuery } from "@/_libs/prisma/queries/get-exercise-by-id-query";
import { getExercisesByTraineeIdQuery } from "@/_libs/prisma/queries/get-exercises-by-trainee-id-query";
import { getLatestRecordQuery } from "@/_libs/prisma/queries/get-latest-record-query";
import { getMusclesByIdsQuery } from "@/_libs/prisma/queries/get-muscles-by-ids-query";
import { getSetsByExerciseIdQuery } from "@/_libs/prisma/queries/get-sets-by-exercise-id-query";
import { getTraineeByIdQuery } from "@/_libs/prisma/queries/get-trainee-by-id-query";


import { deleteExerciseResolver } from "../resolvers/delete-exercise-resolver/delete-exercise-resolver";
import { getAllExercisesResolver } from "../resolvers/get-all-exercises-resolver/get-all-exercises-resolver";
import { getEstimatedMaximumWeightResolver } from "../resolvers/get-estimated-maximum-weight-resolver/get-estimated-maximum-weight-resolver";
import { getExerciseByIdResolver } from "../resolvers/get-exercise-by-id-resolver/get-exercise-by-id-resolver";
import { getLatestRecordResolver } from "../resolvers/get-latest-record-resolver/get-latest-record-resolver";
import { registerExerciseResolver } from "../resolvers/register-exercise-resolver/register-exercise-resolver";
import { updateExerciseResolver } from "../resolvers/update-exercise-resolver/update-exercise-resolver";
import { initializedProcedure, router } from "../trpc";

export const exerciseRouter = router({
  register: initializedProcedure
    .input(exerciseSchema.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      await registerExerciseResolver({
        getMusclesByIdsQuery,
        getTraineeByIdQuery,
        registerExerciseCommand,
      })({
        name: input.name,
        musclesIds: input.targets.map((target) => target.id),
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });
    }),
  getAll: initializedProcedure
    .output(z.array(exerciseSchema))
    .query(async ({ ctx }) => {
      const exercises = await getAllExercisesResolver({
        getExercisesByTraineeIdQuery,
      })({
        traineeId: ctx.trainee.id,
      });

      return exercises;
    }),
  getById: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(exerciseSchema)
    .query(async ({ input, ctx }) => {
      const exercise = await getExerciseByIdResolver({
        getExerciseByIdQuery,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
      });

      return exercise;
    }),
  getEstimatedMaximumWeight: initializedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.union([z.number(), z.null()]))
    .query(async ({ input, ctx }) => {
      const estimatedMaximumWeight = await getEstimatedMaximumWeightResolver({
        getSetsByExerciseIdQuery,
      })({
        traineeId: ctx.trainee.id,
        exerciseId: input.id,
      });

      return estimatedMaximumWeight;
    }),
  getLatestRecord: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(z.union([z.null(), recordSchema]))
    .query(async ({ input, ctx }) => {
      const latestRecord = await getLatestRecordResolver({
        getLatestRecordQuery: getLatestRecordQuery,
      })({
        traineeId: ctx.trainee.id,
        exerciseId: input.id,
      });

      return latestRecord;
    }),
  update: initializedProcedure
    .input(
      z.object({
        before: exerciseSchema,
        after: exerciseSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await updateExerciseResolver({
        getExerciseByIdQuery,
        getMusclesByIdsQuery,
        updateExerciseNameCommand,
        updateExerciseTargetsCommand,
      })({
        before: input.before,
        after: input.after,
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });
    }),
  delete: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await deleteExerciseResolver({
        getExerciseByIdQuery,
        deleteExerciseCommand,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
      });
    }),
});
