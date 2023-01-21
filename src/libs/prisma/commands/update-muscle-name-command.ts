import { Muscle } from "@/features/muscle/muscle";

import prisma from "../client";

export type UpdateMuscleNameCommand = (props: {
  muscle: Muscle;
}) => Promise<void>;
export const updateMuscleNameCommand: UpdateMuscleNameCommand = async (
  props
) => {
  await prisma.muscle.update({
    where: {
      id: props.muscle.id,
    },
    data: {
      name: props.muscle.name,
    },
  });
};
