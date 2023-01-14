import { RegisterTrainingCommand } from "@/libs/prisma/commands/register-training-command";

import { Training } from "@/features/training/training";

type RegisterTrainingResolver = (
  deps: Deps
) => (props: Props) => Promise<Training>;
export type Deps = {
  registerTrainingCommand: RegisterTrainingCommand;
};
export type Props = {
  traineeId: string;
  todaysDate: Date;
  trainingSets: {
    exerciseId: string;
    weight: number;
    repetition: number;
  }[];
};
export const registerTrainingResolver: RegisterTrainingResolver =
  (deps) => async (props) => {
    const registered = await deps.registerTrainingCommand({
      traineeId: props.traineeId,
      todaysDate: props.todaysDate,
      trainingSets: props.trainingSets.map((trainingSet) => ({
        exerciseId: trainingSet.exerciseId,
        weight: trainingSet.weight,
        repetition: trainingSet.repetition,
      })),
    });

    return registered;
  };
