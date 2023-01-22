import { ulid } from "ulid";

import { RegisterTrainingCommand } from "@/libs/prisma/commands/register-training-command";

import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";

type RegisterTrainingResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  registerTrainingCommand: RegisterTrainingCommand;
};
export type Props = {
  records: {
    exercise: Exercise;
    sets: {
      weight: number;
      repetition: number;
    }[];
    memo: string;
  }[];
  trainee: Trainee;
};
export const registerTrainingResolver: RegisterTrainingResolver =
  (deps) => async (props) => {
    await deps.registerTrainingCommand({
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
          memo: record.memo,
        })),
      },
      trainee: props.trainee,
    });
  };
