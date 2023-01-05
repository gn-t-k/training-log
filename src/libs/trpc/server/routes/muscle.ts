import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";

import prisma from "@/libs/prisma/client";

import { muscleSchema } from "@/features/muscle/muscle";

import { protectedProcedure, router } from "../trpc";

export const muscleRouter = router({
  register: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input, ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const traineeData = await prisma.trainee.findUnique({
        where: {
          authUserId,
        },
        select: {
          id: true,
        },
      });

      if (!traineeData) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const registered = await prisma.muscle.create({
        data: {
          id: ulid(),
          name: input.name,
          traineeId: traineeData.id,
        },
      });

      return {
        id: registered.id,
        name: registered.name,
      };
    }),
  getAll: protectedProcedure
    .output(z.array(muscleSchema))
    .query(async ({ ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const traineeData = await prisma.trainee.findUnique({
        where: {
          authUserId,
        },
        include: {
          muscles: true,
        },
      });

      if (traineeData === null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const musclesData = traineeData.muscles;

      return musclesData.map((muscle) => ({
        id: muscle.id,
        name: muscle.name,
      }));
    }),
  getByName: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(z.union([muscleSchema, z.null()]))
    .query(async ({ input, ctx }) => {
      const authUserId = ctx.session.user.id;

      if (!authUserId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const traineeData = await prisma.trainee.findUnique({
        where: {
          authUserId,
        },
        include: {
          muscles: {
            where: {
              name: input.name,
            },
          },
        },
      });

      if (traineeData === null) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const muscleData = traineeData.muscles[0];

      return muscleData ? { id: muscleData.id, name: muscleData.name } : null;
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input }) => {
      const updated = await prisma.muscle.update({
        where: {
          id: input.id,
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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .output(muscleSchema)
    .mutation(async ({ input }) => {
      const deleted = await prisma.muscle.delete({
        where: {
          id: input.id,
        },
      });

      return {
        id: deleted.id,
        name: deleted.name,
      };
    }),
});
