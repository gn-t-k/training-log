import prisma from "../client";

import type { Muscle } from "@/features/muscle/muscle";


export type DeleteMuscleCommand = (props: { muscle: Muscle }) => Promise<void>;
export const deleteMuscleCommand: DeleteMuscleCommand = async (props) => {
  await prisma.muscle.delete({
    where: {
      id: props.muscle.id,
    },
  });
};
