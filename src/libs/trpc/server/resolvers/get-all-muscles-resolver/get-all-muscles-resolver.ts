import { GetAllMusclesQuery } from "@/libs/prisma/queries/get-all-muscles-query";

import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";

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
