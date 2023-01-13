import { Muscle } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { Deps, Props, deleteMuscleResolver } from "./delete-muscle-resolver";

describe("deleteMuscleResolver", () => {
  const musclesData: Muscle[] = [
    {
      id: "1",
      name: "大胸筋",
      traineeId: "trainee1",
    },
    {
      id: "2",
      name: "上腕二頭筋",
      traineeId: "trainee1",
    },
    {
      id: "3",
      name: "広背筋",
      traineeId: "trainee2",
    },
  ];
  const deps: Deps = {
    getMuscleByIdQuery: async ({ id }) => {
      const muscle = musclesData.find((muscle) => muscle.id === id);

      return muscle ?? null;
    },
    deleteMuscleCommand: jest.fn(),
  };

  test("部位が存在しなかった場合エラーになる", async () => {
    const props: Props = {
      id: "4",
      traineeId: "trainee1",
    };

    const deleteMusclePromise = deleteMuscleResolver(deps)(props);

    await expect(deleteMusclePromise).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
      })
    );
  });

  test("他のトレーニーの部位を削除しようとした場合エラーになる", async () => {
    const props: Props = {
      id: "3",
      traineeId: "trainee1",
    };

    const deleteMusclePromise = deleteMuscleResolver(deps)(props);

    await expect(deleteMusclePromise).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
      })
    );
  });
});
