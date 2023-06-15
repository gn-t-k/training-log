
import type { Muscle } from "@/_features/muscle/muscle";
import type { Trainee } from "@/_features/trainee/trainee";
import type { GetAllMusclesQuery } from "@/_libs/prisma/queries/get-all-muscles-query";

type GetAllMusclesResolver = (
  deps: Deps
) => (props: Props) => Promise<Muscle[]>;
export type Deps = { getAllMusclesQuery: GetAllMusclesQuery };
export type Props = {
  trainee: Trainee;
};
export const getAllMusclesResolver: GetAllMusclesResolver =
  (deps) => async (props) => {
    const musclesData = await deps.getAllMusclesQuery({
      trainee: props.trainee,
    });

    return musclesData;
  };
