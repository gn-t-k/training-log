import { GetAllMusclesQuery } from "@/libs/prisma/queries/get-all-muscles-query";

import { Muscle } from "@/features/muscle/muscle";

type GetAllMusclesResolver = (
  deps: Deps
) => (props: Props) => Promise<Muscle[]>;
export type Deps = { getAllMusclesQuery: GetAllMusclesQuery };
export type Props = {
  traineeId: string;
};
export const getAllMusclesResolver: GetAllMusclesResolver =
  (deps) => async (props) => {
    const musclesData = await deps.getAllMusclesQuery({
      traineeId: props.traineeId,
    });

    return musclesData;
  };
