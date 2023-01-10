import { Muscle } from "@prisma/client";

import prisma from "../client";

export type UpdateMuscleNameCommand = (props: {
  id: string;
  name: string;
}) => Promise<Muscle>;
export const updateMuscleNameCommand: UpdateMuscleNameCommand = async ({
  id,
  name,
}) => {
  const updated = await prisma.muscle.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return updated;
};
