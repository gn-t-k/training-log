import { z } from "zod";

import { deleteExerciseCommand } from "@/libs/prisma/commands/delete-exercise-command";
import { registerExerciseCommand } from "@/libs/prisma/commands/register-exercise-command";
import { updateExerciseCommand } from "@/libs/prisma/commands/update-exercise-command";
import { updateExerciseNameCommand } from "@/libs/prisma/commands/update-exercise-name-command";
import { updateExerciseTargetsCommand } from "@/libs/prisma/commands/update-exercise-targets-command";
import { getExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";
import { getExercisesByTraineeIdQuery } from "@/libs/prisma/queries/get-exercises-by-trainee-id-query";
import { getMusclesByIdsQuery } from "@/libs/prisma/queries/get-muscles-by-ids-query";

import { exerciseSchema } from "@/features/exercise/exercise";

import { deleteExerciseResolver } from "../resolvers/delete-exercise-resolver/delete-exercise-resolver";
import { getAllExercisesResolver } from "../resolvers/get-all-exercises-resolver/get-all-exercises-resolver";
import { getExerciseByIdResolver } from "../resolvers/get-exercise-by-id-resolver/get-exercise-by-id-resolver";
import { registerExerciseResolver } from "../resolvers/register-exercise-resolver/register-exercise-resolver";
import { updateExerciseNameResolver } from "../resolvers/update-exercise-name-resolver/update-exercise-name-resolver";
import { updateExerciseResolver } from "../resolvers/update-exercise-resolver/update-exercise-resolver";
import { updateExerciseTargetsResolver } from "../resolvers/update-exercise-targets-resolver/update-exercise-targets-resolver";
import { initializedProcedure, router } from "../trpc";

export const exerciseRouter = router({
  register: initializedProcedure
    .input(exerciseSchema.omit({ id: true }))
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const registered = await registerExerciseResolver({
        getMusclesByIdsQuery,
        registerExerciseCommand,
      })({
        name: input.name,
        musclesIds: input.targets.map((target) => target.id),
        traineeId: ctx.trainee.id,
      });

      return registered;
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
  update: initializedProcedure
    .input(
      z
        .object({
          id: z.string(),
          name: z.string(),
        })
        .and(exerciseSchema.pick({ targets: true }))
    )
    .output(exerciseSchema)
    .mutation(async ({ input, ctx }) => {
      const updated = await updateExerciseResolver({
        getExerciseByIdQuery,
        getMusclesByIdsQuery,
        updateExerciseCommand,
      })({
        id: input.id,
        name: input.name,
        targetIds: input.targets.map((target) => target.id),
        traineeId: ctx.trainee.id,
      });

      return updated;
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
      const updated = updateExerciseNameResolver({
        getExerciseByIdQuery,
        updateExerciseNameCommand,
      })({
        id: input.id,
        name: input.name,
        traineeId: ctx.trainee.id,
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
      const updated = await updateExerciseTargetsResolver({
        getExerciseByIdQuery,
        getMusclesByIdsQuery,
        updateExerciseTargetsCommand,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
        targetIds: input.targets.map((target) => target.id),
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
      const deleted = await deleteExerciseResolver({
        getExerciseByIdQuery,
        deleteExerciseCommand,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
      });

      return deleted;
    }),
});
