import prisma from "../client";

import type { Muscle } from "@/features/muscle/muscle";
import type { Trainee } from "@/features/trainee/trainee";


export type RegisterMuscleCommand = (props: {
  muscle: Muscle;
  trainee: Trainee;
}) => Promise<void>;
export const registerMuscleCommand: RegisterMuscleCommand = async (props) => {
  await prisma.muscle.create({
    data: {
      id: props.muscle.id,
      name: props.muscle.name,
      trainee: {
        connect: {
          id: props.trainee.id,
        },
      },
    },
  });
};
