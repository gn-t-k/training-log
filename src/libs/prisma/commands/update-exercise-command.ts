import { Exercise, Muscle } from "@prisma/client";

import prisma from "../client";

export type UpdateExerciseCommand = (props: {
  id: string;
  name: string;
  musclesIds: {
    before: string[];
    after: string[];
  };
}) => Promise<Exercise & { targets: Muscle[] }>;
export const updateExerciseCommand: UpdateExerciseCommand = async (props) => {
  const updated = await prisma.$transaction(async (tx) => {
    const deleted = await tx.exercise.update({
      where: {
        id: props.id,
      },
      data: {
        targets: {
          disconnect: props.musclesIds.before.map((id) => ({ id })),
        },
      },
      include: {
        targets: true,
      },
    });

    if (deleted.targets.length !== 0) {
      throw new Error("更新処理に失敗しました");
    }

    const updated = await tx.exercise.update({
      where: {
        id: props.id,
      },
      data: {
        name: props.name,
        targets: {
          connect: props.musclesIds.after.map((id) => ({ id })),
        },
      },
      include: {
        targets: true,
      },
    });

    return updated;
  });

  return updated;
};
