import { ulid } from "ulid";

import type { RegisterTraineeCommand } from "@/_libs/prisma/commands/register-trainee-command";

type RegisterTraineeResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  registerTraineeCommand: RegisterTraineeCommand;
};
export type Props = {
  authUserId: string;
  name: string;
  image: string;
};
export const registerTraineeResolver: RegisterTraineeResolver =
  (deps) => async (props) => {
    await deps.registerTraineeCommand({
      id: ulid(),
      authUserId: props.authUserId,
      name: props.name,
      image: props.image,
    });
  };
