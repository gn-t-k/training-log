import { Trainee } from "@/features/trainee/trainee";
import { Training } from "@/features/training/training";

import prisma from "../client";

export type RegisterTrainingCommand = (props: {
  trainee: Trainee;
  training: Training;
}) => Promise<void>;
export const registerTrainingCommand: RegisterTrainingCommand = async (
  props
) => {
  await prisma.$transaction(async (tx) => {
    await tx.training.create({
      data: {
        id: props.training.id,
        createdAt: props.training.createdAt,
        updatedAt: props.training.createdAt,
        trainee: {
          connect: {
            id: props.trainee.id,
          },
        },
      },
    });

    await tx.record.createMany({
      data: props.training.records.map((record) => ({
        id: record.id,
        trainingId: props.training.id,
        exerciseId: record.exercise.id,
        memo: record.memo,
      })),
    });

    await tx.set.createMany({
      data: props.training.records.flatMap((record) =>
        record.sets.map((set) => ({
          id: set.id,
          recordId: record.id,
          weight: set.weight,
          repetition: set.repetition,
        }))
      ),
    });
  });
};
