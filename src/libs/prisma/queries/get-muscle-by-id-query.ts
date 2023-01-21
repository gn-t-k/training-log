import { Muscle } from "@/features/muscle/muscle";

import prisma from "../client";

export type GetMuscleByIdQuery = (props: {
  id: string;
}) => Promise<(Muscle & { traineeId: string }) | null>;
export const getMuscleByIdQuery: GetMuscleByIdQuery = async ({ id }) => {
  const muscle = await prisma.muscle.findUnique({
    where: {
      id,
    },
  });

  return muscle;
};
