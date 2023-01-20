import { z } from "zod";

import { exerciseSchema } from "../exercise/exercise";

const setSchema = z.object({
  id: z.string(),
  weight: z.number(),
  repetition: z.number(),
});
const recordSchema = z.object({
  id: z.string(),
  exercise: exerciseSchema,
  sets: z.array(setSchema),
});
export const trainingSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  records: z.array(recordSchema),
});

export type Training = z.infer<typeof trainingSchema>;
