import prisma from "../client";

import type { Muscle } from "@/features/muscle/muscle";


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
