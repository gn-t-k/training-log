import { z } from "zod";

export const muscleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Trainee = z.infer<typeof muscleSchema>;
