import { Muscle } from "@/features/muscle/muscle";

import { Deps, getAllMusclesResolver, Props } from "./get-all-muscles-resolver";

describe("getAllMusclesResolver", () => {
  test("すべての部位が取得できる", async () => {
    const deps: Deps = {
      getAllMusclesQuery: async ({ traineeId: _ }) => {
        return Promise.resolve(muscles);
      },
    };
    const props: Props = {
      traineeId: "id",
    };
    const muscles: Muscle[] = [
      {
        id: "id",
        name: "大胸筋",
      },
    ];

    const result = await getAllMusclesResolver(deps)(props);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(muscles[0]);
  });
});
