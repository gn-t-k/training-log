import { Muscle } from "@prisma/client";

import { Deps, getAllMusclesResolver, Props } from "./get-all-muscles-resolver";

describe("getAllMusclesResolver", () => {
  test("すべての部位が取得できる", async () => {
    const deps: Deps = {
      getAllMusclesQuery: async (_) => {
        return Promise.resolve(musclesData);
      },
    };
    const props: Props = {
      trainee: {
        id: "id",
        name: "name",
        image: "image",
      },
    };
    const musclesData: Muscle[] = [
      {
        id: "id",
        name: "大胸筋",
        traineeId: "trainee1",
      },
    ];

    const result = await getAllMusclesResolver(deps)(props);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(musclesData[0]);
  });
});
