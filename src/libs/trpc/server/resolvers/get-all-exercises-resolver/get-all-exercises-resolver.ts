import { GetExercisesByTraineeIdQuery } from "@/libs/prisma/queries/get-exercises-by-trainee-id-query";

import { Exercise } from "@/features/exercise/exercise";

type GetAllExercisesResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise[]>;
export type Deps = {
  getExercisesByTraineeIdQuery: GetExercisesByTraineeIdQuery;
};
export type Props = {
  traineeId: string;
};
export const getAllExercisesResolver: GetAllExercisesResolver =
  (deps) => async (props) => {
    const exercisesData = await deps.getExercisesByTraineeIdQuery({
      traineeId: props.traineeId,
    });

    return exercisesData;
  };
