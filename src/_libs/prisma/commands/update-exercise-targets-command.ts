import prisma from "../client";

import type { Exercise } from "@/_features/exercise/exercise";

export type UpdateExerciseTargetsCommand = (props: {
  before: Exercise;
  after: Exercise;
}) => Promise<void>;
export const updateExerciseTargetsCommand: UpdateExerciseTargetsCommand =
  async (props) => {
    await prisma.$transaction(async (tx) => {
      await tx.exercise.update({
        where: {
          id: props.before.id,
        },
        data: {
          targets: {
            disconnect: props.before.targets.map((target) => ({
              id: target.id,
            })),
          },
        },
      });

      await tx.exercise.update({
        where: {
          id: props.before.id,
        },
        data: {
          targets: {
            connect: props.after.targets.map((target) => ({ id: target.id })),
          },
        },
        include: {
          targets: true,
        },
      });
    });
  };
