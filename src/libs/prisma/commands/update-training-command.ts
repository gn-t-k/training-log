import { Training } from "@/features/training/training";

import prisma from "../client";

export type UpdateTrainingCommand = (props: {
  updatedAt: Date;
  training: {
    before: Training;
    after: Training;
  };
}) => Promise<void>;
export const updateTrainingCommand: UpdateTrainingCommand = async (props) => {
  if (props.training.before.id !== props.training.after.id) {
    throw new Error("trainingのidは更新できません");
  }

  await prisma.$transaction(async (tx) => {
    await tx.set.deleteMany({
      where: {
        id: {
          in: props.training.before.records.flatMap((record) =>
            record.sets.map((set) => set.id)
          ),
        },
      },
    });

    await tx.record.deleteMany({
      where: {
        id: {
          in: props.training.before.records.map((record) => record.id),
        },
      },
    });

    await tx.training.update({
      where: {
        id: props.training.after.id,
      },
      data: {
        updatedAt: props.updatedAt,
      },
    });

    await tx.record.createMany({
      data: props.training.after.records.map((record) => ({
        id: record.id,
        trainingId: props.training.after.id,
        exerciseId: record.exercise.id,
        memo: record.memo,
      })),
    });

    await tx.set.createMany({
      data: props.training.after.records.flatMap((record) =>
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
