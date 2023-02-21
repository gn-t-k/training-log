import { z } from "zod";

import { deleteMuscleCommand } from "@/libs/prisma/commands/delete-muscle-command";
import { registerMuscleCommand } from "@/libs/prisma/commands/register-muscle-command";
import { updateMuscleNameCommand } from "@/libs/prisma/commands/update-muscle-name-command";
import { getAllMusclesQuery } from "@/libs/prisma/queries/get-all-muscles-query";
import { getMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";
import { getMuscleByNameQuery } from "@/libs/prisma/queries/get-muscle-by-name-query";
import { getWeeklyNumberOfSetsByMuscleIdQuery } from "@/libs/prisma/queries/get-weekly-number-of-sets-by-muscle-id-query";

import { muscleSchema } from "@/features/muscle/muscle";

import { deleteMuscleResolver } from "../resolvers/delete-muscle-resolver/delete-muscle-resolver";
import { getAllMusclesResolver } from "../resolvers/get-all-muscles-resolver/get-all-muscles-resolver";
import { getMuscleByIdResolver } from "../resolvers/get-muscle-by-id-resolver/get-muscle-by-id-resolver";
import { getMuscleByNameResolver } from "../resolvers/get-muscle-by-name-resolver/get-muscle-by-name-resolver";
import { getWeeklyNumberOfSetsByMuscleIdResolver } from "../resolvers/get-weekly-number-of-sets-by-muscle-id-resolver/get-weekly-number-of-sets-by-muscle-id-resolver";
import { registerMuscleResolver } from "../resolvers/register-muscle-resolver/register-muscle-resolver";
import { updateMuscleNameResolver } from "../resolvers/update-muscle-name-resolver/update-muscle-name-resolver";
import { initializedProcedure, router } from "../trpc";

export const muscleRouter = router({
  register: initializedProcedure
    .input(muscleSchema.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      await registerMuscleResolver({
        registerMuscleCommand,
      })({
        name: input.name,
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });
    }),
  getAll: initializedProcedure
    .output(z.array(muscleSchema))
    .query(async ({ ctx }) => {
      const muscles = await getAllMusclesResolver({ getAllMusclesQuery })({
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });

      return muscles;
    }),
  getById: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(muscleSchema)
    .query(async ({ input, ctx }) => {
      const muscle = await getMuscleByIdResolver({ getMuscleByIdQuery })({
        id: input.id,
        trainee: {
          id: ctx.trainee.id,
          name: ctx.trainee.name,
          image: ctx.trainee.image,
        },
      });

      return muscle;
    }),
  getByName: initializedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(muscleSchema)
    .query(async ({ input, ctx }) => {
      const muscle = await getMuscleByNameResolver({ getMuscleByNameQuery })({
        name: input.name,
        traineeId: ctx.trainee.id,
      });

      return muscle;
    }),
  getWeeklyNumberOfSets: initializedProcedure
    .input(
      z.object({
        id: z.string(),
        start: z.date(),
      })
    )
    .output(z.number())
    .query(async ({ input, ctx }) => {
      const weeklyNumberOfSets = await getWeeklyNumberOfSetsByMuscleIdResolver({
        getWeeklyNumberOfSetsByMuscleIdQuery,
      })({
        muscleId: input.id,
        start: input.start,
        traineeId: ctx.trainee.id,
      });

      return weeklyNumberOfSets;
    }),
  updateName: initializedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await updateMuscleNameResolver({
        getMuscleByIdQuery,
        updateMuscleNameCommand,
      })({
        id: input.id,
        name: input.name,
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
      await deleteMuscleResolver({
        getMuscleByIdQuery,
        deleteMuscleCommand,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
      });
    }),
});
