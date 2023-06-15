import type { Trainee } from "@/_features/trainee/trainee";
import type { GetTraineeByAuthUserIdQuery } from "@/_libs/prisma/queries/get-trainee-by-auth-user-id-query";


type GetTraineeBySessionResolver = (
  deps: Deps
) => (props: Props) => Promise<Trainee | null>;
export type Deps = {
  getTraineeByAuthUserIdQuery: GetTraineeByAuthUserIdQuery;
};
export type Props = {
  authUserId: string;
};
export const getTraineeBySessionResolver: GetTraineeBySessionResolver =
  (deps) => async (props) => {
    const traineeData = await deps.getTraineeByAuthUserIdQuery({
      authUserId: props.authUserId,
    });

    if (!traineeData?.id || !traineeData.name || !traineeData.image) {
      return null;
    }

    return traineeData;
  };
