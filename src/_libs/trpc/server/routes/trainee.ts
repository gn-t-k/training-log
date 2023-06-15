import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { traineeSchema } from "@/_features/trainee/trainee";
import { registerTraineeCommand } from "@/_libs/prisma/commands/register-trainee-command";
import { getTraineeByAuthUserIdQuery } from "@/_libs/prisma/queries/get-trainee-by-auth-user-id-query";


import { getTraineeBySessionResolver } from "../resolvers/get-trainee-by-session-resolver/get-trainee-by-session-resolver";
import { registerTraineeResolver } from "../resolvers/register-trainee-resolver/register-trainee-resolver";
import { authenticatedProcedure, router } from "../trpc";

export const traineeRouter = router({
  getBySession: authenticatedProcedure
    .output(z.union([traineeSchema, z.null()]))
    .query(async ({ ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        return null;
      }

      const trainee = await getTraineeBySessionResolver({
        getTraineeByAuthUserIdQuery,
      })({
        authUserId,
      });

      return trainee;
    }),
  register: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      await registerTraineeResolver({
        registerTraineeCommand,
      })({
        authUserId,
        name: input.name,
        image: input.image,
      });
    }),
});
