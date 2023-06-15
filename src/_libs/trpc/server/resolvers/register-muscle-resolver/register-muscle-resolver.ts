import { ulid } from "ulid";

import type { Trainee } from "@/_features/trainee/trainee";
import type { RegisterMuscleCommand } from "@/_libs/prisma/commands/register-muscle-command";


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
