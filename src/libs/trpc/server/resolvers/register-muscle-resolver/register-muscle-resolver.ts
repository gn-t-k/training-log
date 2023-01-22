import { ulid } from "ulid";

import { RegisterMuscleCommand } from "@/libs/prisma/commands/register-muscle-command";

import { Trainee } from "@/features/trainee/trainee";

type RegisterMuscleResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  registerMuscleCommand: RegisterMuscleCommand;
};
export type Props = { trainee: Trainee; name: string };
export const registerMuscleResolver: RegisterMuscleResolver =
  (deps) => async (props) => {
    await deps.registerMuscleCommand({
      muscle: {
        id: ulid(),
        name: props.name,
      },
      trainee: props.trainee,
    });
  };
