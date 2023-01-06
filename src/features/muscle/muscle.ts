import { z } from "zod";

export const muscleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Muscle = z.infer<typeof muscleSchema>;
