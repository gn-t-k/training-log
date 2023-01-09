import { ulid } from "ulid";

import { Muscle } from "@/features/muscle/muscle";

import prisma from "../client";

export type RegisterMuscleCommand = (props: {
  traineeId: string;
  name: string;
}) => Promise<Muscle>;
export const registerMuscleCommand: RegisterMuscleCommand = async ({
  traineeId,
  name,
}) => {
  const registered = await prisma.muscle.create({
    data: {
      id: ulid(),
      name,
      traineeId,
    },
  });

  return registered;
};
