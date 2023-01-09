import { RegisterMuscleCommand } from "@/libs/prisma/commands/register-muscle-command";

import { Muscle } from "@/features/muscle/muscle";

type RegisterMuscleResolver = (deps: Deps) => (props: Props) => Promise<Muscle>;
export type Deps = {
  registerMuscleCommand: RegisterMuscleCommand;
};
export type Props = { traineeId: string; name: string };
export const registerMuscleResolver: RegisterMuscleResolver =
  (deps) => async (props) => {
    const registered = await deps.registerMuscleCommand({
      traineeId: props.traineeId,
      name: props.name,
    });

    return registered;
  };
