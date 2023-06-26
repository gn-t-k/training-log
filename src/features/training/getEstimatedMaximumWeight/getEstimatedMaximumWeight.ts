import type { Set } from "@/features/training/training";

type GetEstimatedMaximumWeight = (set: Set) => number;
export const getEstimatedMaximumWeight: GetEstimatedMaximumWeight = (set) => {
  if (set.repetition < 1) {
    return 0;
  }

  if (1 <= set.repetition && set.repetition < 2) {
    return Math.round(set.weight);
  }

  if (2 <= set.repetition && set.repetition < 3) {
    return Math.round(set.weight / 0.95);
  }

  if (3 <= set.repetition && set.repetition < 4) {
    return Math.round(set.weight / 0.93);
  }

  if (4 <= set.repetition && set.repetition < 5) {
    return Math.round(set.weight / 0.9);
  }

  if (5 <= set.repetition && set.repetition < 6) {
    return Math.round(set.weight / 0.87);
  }

  if (6 <= set.repetition && set.repetition < 7) {
    return Math.round(set.weight / 0.85);
  }

  if (7 <= set.repetition && set.repetition < 8) {
    return Math.round(set.weight / 0.83);
  }

  if (8 <= set.repetition && set.repetition < 9) {
    return Math.round(set.weight / 0.8);
  }

  if (9 <= set.repetition && set.repetition < 10) {
    return Math.round(set.weight / 0.77);
  }

  if (10 <= set.repetition && set.repetition < 11) {
    return Math.round(set.weight / 0.75);
  }

  if (11 <= set.repetition && set.repetition < 12) {
    return Math.round(set.weight / 0.7);
  }

  if (12 <= set.repetition && set.repetition < 13) {
    return Math.round(set.weight / 0.67);
  }

  return Math.round(
    (100 * set.weight) /
      (48.8 + 53.8 * Math.pow(Math.E, -0.075 * set.repetition))
  );
};
