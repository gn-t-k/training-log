import { Muscle } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  Deps,
  Props,
  updateMuscleNameResolver,
} from "./update-muscle-name-resolver";

describe("updateMuscleNameResolver", () => {
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
    updateMuscleNameCommand: jest.fn(),
  };

  test("部位が存在しなかった場合エラーになる", async () => {
    const props: Props = {
      id: "4",
      name: "腕",
      trainee: {
        id: "trainee1",
        name: "name1",
        image: "image",
      },
    };

    const updateMuscleNamePromise = updateMuscleNameResolver(deps)(props);

    await expect(updateMuscleNamePromise).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
      })
    );
  });

  test("他のトレーニーの部位の名前を更新しようとした場合エラーになる", async () => {
    const props: Props = {
      id: "3",
      name: "背中",
      trainee: {
        id: "trainee1",
        name: "name1",
        image: "image",
      },
    };

    const updateMuscleNamePromise = updateMuscleNameResolver(deps)(props);

    await expect(updateMuscleNamePromise).rejects.toThrowError(
      new TRPCError({
        code: "NOT_FOUND",
      })
    );
  });
});
