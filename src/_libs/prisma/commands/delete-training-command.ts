import prisma from "../client";

import type { Training } from "@/_features/training/training";

export type DeleteTrainingCommand = (props: {
  training: Training;
}) => Promise<void>;
export const deleteTrainingCommand: DeleteTrainingCommand = async (props) => {
  const recordIds = props.training.records.map((record) => record.id);
  const setIds = props.training.records.flatMap((record) =>
    record.sets.map((set) => set.id)
  );

  await prisma.$transaction(async (tx) => {
    await tx.set.deleteMany({
      where: {
        id: {
          in: setIds,
        },
      },
    });
    await tx.record.deleteMany({
      where: {
        id: {
          in: recordIds,
        },
      },
    });
    await tx.training.delete({
      where: {
        id: props.training.id,
      },
    });
  });
};
