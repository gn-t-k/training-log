import { RegisterTrainingCommand } from "@/libs/prisma/commands/register-training-command";

import { Exercise } from "@/features/exercise/exercise";

type RegisterTrainingResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  registerTrainingCommand: RegisterTrainingCommand;
};
export type Props = {
  traineeId: string;
  todaysDate: Date;
  exercises: {
    exercise: Exercise;
    sets: {
      weight: number;
      repetition: number;
    }[];
  }[];
};
export const registerTrainingResolver: RegisterTrainingResolver =
  (deps) => async (props) => {
    await deps.registerTrainingCommand({
      traineeId: props.traineeId,
      todaysDate: props.todaysDate,
      exercises: props.exercises.map((exercise) => ({
        exerciseId: exercise.exercise.id,
        sets: exercise.sets,
      })),
    });
  };
