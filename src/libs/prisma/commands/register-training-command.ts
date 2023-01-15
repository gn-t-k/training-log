import { ulid } from "ulid";

import prisma from "../client";

export type RegisterTrainingCommand = (props: {
  traineeId: string;
  todaysDate: Date;
  exercises: {
    exerciseId: string;
    sets: {
      weight: number;
      repetition: number;
    }[];
  }[];
}) => Promise<void>;
export const registerTrainingCommand: RegisterTrainingCommand = async (
  props
) => {
  await prisma.$transaction(async (tx) => {
    const trainingId = ulid();

    await tx.training.create({
      data: {
        id: trainingId,
        createdAt: props.todaysDate,
        updatedAt: props.todaysDate,
        traineeId: props.traineeId,
      },
    });

    const trainingExerciseIdMap = props.exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      trainingExerciseId: ulid(),
    }));

    await tx.trainingExercise.createMany({
      data: trainingExerciseIdMap.map((v) => ({
        trainingId,
        id: v.trainingExerciseId,
        exerciseId: v.exerciseId,
      })),
    });

    await tx.trainingExerciseSet.createMany({
      data: props.exercises.flatMap((exercise) => {
        const trainingExerciseId = trainingExerciseIdMap.find(
          (v) => v.exerciseId === exercise.exerciseId
        )?.trainingExerciseId;

        return trainingExerciseId
          ? exercise.sets.map((set) => ({
              id: ulid(),
              trainingExerciseId,
              weight: set.weight,
              repetition: set.repetition,
            }))
          : [];
      }),
    });
  });
};
