import { getEstimatedMaximumWeight } from "./getEstimatedMaximumWeight";

import type { Set } from "@/features/training/training";

describe("getEstimatedMaximumWeight", () => {
  describe("回数が12回以下の場合", () => {
    test("60kgを10回できた場合の推定1RM(最大挙上重量)は80kg", () => {
      const set: Set = {
        id: "id",
        weight: 60,
        repetition: 10,
      };

      const estimatedMaximumWeight = getEstimatedMaximumWeight(set);

      expect(estimatedMaximumWeight).toBe(80);
    });
  });

  describe("回数が13回以上の場合", () => {
    test("6kgを15回できた場合の推定1RM（最大挙上重量）は9kg", () => {
      const set: Set = {
        id: "id",
        weight: 6,
        repetition: 15,
      };

      const estimatedMaximumWeight = getEstimatedMaximumWeight(set);

      expect(estimatedMaximumWeight).toBe(9);
    });
  });
});
