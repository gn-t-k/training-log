import { z } from "zod";

import { exerciseSchema } from "../exercise/exercise";

export const setSchema = z.object({
  id: z.string(),
  weight: z.number(),
  repetition: z.number(),
});
export const recordSchema = z.object({
  id: z.string(),
  exercise: exerciseSchema,
  sets: z.array(setSchema),
  memo: z.string(),
});
export const trainingSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  records: z.array(recordSchema),
});

export type Set = z.infer<typeof setSchema>;
export type Record = z.infer<typeof recordSchema>;
export type Training = z.infer<typeof trainingSchema>;
