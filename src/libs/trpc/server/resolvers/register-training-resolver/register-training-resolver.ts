import { ulid } from "ulid";

import { RegisterTrainingCommand } from "@/libs/prisma/commands/register-training-command";

import { Exercise } from "@/features/exercise/exercise";

type RegisterTrainingResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  registerTrainingCommand: RegisterTrainingCommand;
};
export type Props = {
  traineeId: string;
  records: {
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
      training: {
        id: ulid(),
        createdAt: new Date(),
        records: props.records.map((record) => ({
          id: ulid(),
          exercise: record.exercise,
          sets: record.sets.map((set) => ({
            id: ulid(),
            weight: set.weight,
            repetition: set.repetition,
          })),
        })),
      },
    });
  };
