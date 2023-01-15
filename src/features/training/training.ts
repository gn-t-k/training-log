import { z } from "zod";

import { exerciseSchema } from "../exercise/exercise";

const setSchema = z.object({
  weight: z.number(),
  repetition: z.number(),
});
const trainingExerciseSchema = z.object({
  exercise: exerciseSchema,
  sets: z.array(setSchema),
});
export const trainingSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  exercises: z.array(trainingExerciseSchema),
});

export type Training = z.infer<typeof trainingSchema>;
