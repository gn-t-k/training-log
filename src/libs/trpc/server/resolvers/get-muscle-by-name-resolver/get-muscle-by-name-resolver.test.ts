import { Muscle } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  Deps,
  Props,
  getMuscleByNameResolver,
} from "./get-muscle-by-name-resolver";

describe("getMuscleByNameResolver", () => {
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
    getMuscleByNameQuery: async ({ name, traineeId }) => {
      const muscle = musclesData.find(
        (muscle) => muscle.traineeId === traineeId && muscle.name === name
      );

      return muscle ?? null;
    },
  };

  test("名前で部位が取得できる", async () => {
    const props: Props = {
      name: "大胸筋",
      traineeId: "trainee1",
    };

    const muscle = await getMuscleByNameResolver(deps)(props);

    expect(muscle.id).toBe("1");
  });

  test("該当する名前の部位がなかった場合、エラーになる", async () => {
    const props: Props = {
      name: "上腕三頭筋",
      traineeId: "trainee1",
    };
    const musclePromise = getMuscleByNameResolver(deps)(props);

    await expect(musclePromise).rejects.toThrowError(
      new TRPCError({ code: "NOT_FOUND" })
    );
  });

  test("別のトレーニーの部位は取得できない", async () => {
    const props: Props = {
      name: "広背筋",
      traineeId: "trainee1",
    };
    const musclePromise = getMuscleByNameResolver(deps)(props);

    await expect(musclePromise).rejects.toThrowError(
      new TRPCError({ code: "NOT_FOUND" })
    );
  });
});
