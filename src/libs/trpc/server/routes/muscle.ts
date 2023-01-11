import { z } from "zod";

import { deleteMuscleCommand } from "@/libs/prisma/commands/delete-muscle-command";
import { registerMuscleCommand } from "@/libs/prisma/commands/register-muscle-command";
import { updateMuscleNameCommand } from "@/libs/prisma/commands/update-muscle-name-command";
import { getAllMusclesQuery } from "@/libs/prisma/queries/get-all-muscles-query";
import { getMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";
import { getMuscleByNameQuery } from "@/libs/prisma/queries/get-muscle-by-name-query";

import { muscleSchema } from "@/features/muscle/muscle";

import { deleteMuscleResolver } from "../resolvers/delete-muscle-resolver/delete-muscle-resolver";
import { getAllMusclesResolver } from "../resolvers/get-all-muscles-resolver/get-all-muscles-resolver";
import { getMuscleByNameResolver } from "../resolvers/get-muscle-by-name-resolver/get-muscle-by-name-resolver";
import { registerMuscleResolver } from "../resolvers/register-muscle-resolver/register-muscle-resolver";
import { updateMuscleNameResolver } from "../resolvers/update-muscle-name-resolver/update-muscle-name-resolver";
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
    .output(muscleSchema)
    .query(async ({ input, ctx }) => {
      const muscle = await getMuscleByNameResolver({ getMuscleByNameQuery })({
        name: input.name,
        traineeId: ctx.trainee.id,
      });

      return muscle;
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
      const updated = await updateMuscleNameResolver({
        getMuscleByIdQuery,
        updateMuscleNameCommand,
      })({
        id: input.id,
        name: input.name,
        traineeId: ctx.trainee.id,
      });

      return updated;
    }),
  delete: initializedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const deleted = await deleteMuscleResolver({
        getMuscleByIdQuery,
        deleteMuscleCommand,
      })({
        id: input.id,
        traineeId: ctx.trainee.id,
      });

      return deleted;
    }),
});
