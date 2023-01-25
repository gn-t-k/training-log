import { ulid } from "ulid";

import type { RegisterTrainingCommand } from "@/libs/prisma/commands/register-training-command";

import type { Exercise } from "@/features/exercise/exercise";
import type { Trainee } from "@/features/trainee/trainee";

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
  createdAt: Date;
  trainee: Trainee;
};
export const registerTrainingResolver: RegisterTrainingResolver =
  (deps) => async (props) => {
    await deps.registerTrainingCommand({
      training: {
        id: ulid(),
        createdAt: props.createdAt,
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
