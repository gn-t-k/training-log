import { Exercise, Muscle } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  Deps,
  Props,
  updateExerciseTargetsResolver,
} from "./update-exercise-targets-resolver";

describe("updateExerciseTargetsResolver", () => {
  const exercisesData: (Exercise & { targets: Muscle[] })[] = [
    {
      id: "id-e-1",
      name: "ベンチプレス",
      traineeId: "id-t-1",
      targets: [
        {
          id: "id-m-1",
          name: "大胸筋",
          traineeId: "id-t-1",
        },
      ],
    },
    {
      id: "id-e-2",
      name: "スクワット",
      traineeId: "id-t-2",
      targets: [
        {
          id: "id-m-2",
          name: "大腿四頭筋",
          traineeId: "id-t-2",
        },
      ],
    },
  ];

  test("他のトレーニーの種目を変更しようとするとエラーになる", async () => {
    const deps: Deps = {
      getExerciseByIdQuery: async ({ id }) => {
        return exercisesData.find((exercise) => exercise.id === id) ?? null;
      },
      getMusclesByIdsQuery: jest.fn(),
      updateExerciseTargetsCommand: jest.fn(),
    };
    const props: Props = {
      id: "id-e-2",
      targetIds: ["id-t-3"],
      traineeId: "id-t-1",
    };

    const updateExerciseTargetsPromise =
      updateExerciseTargetsResolver(deps)(props);

    await expect(updateExerciseTargetsPromise).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
      })
    );
  });
});
