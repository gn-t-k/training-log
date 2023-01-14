import { z } from "zod";

import { exerciseSchema } from "../exercise/exercise";

export const trainingSetSchema = z.object({
  weight: z.number(),
  repetition: z.number(),
  exercise: exerciseSchema,
});

export const trainingSchema = z.object({
  id: z.string(),
  trainingSets: z.array(trainingSetSchema),
  createdAt: z.date(),
});

export type Training = z.infer<typeof trainingSchema>;
