import { z } from "zod";

export const TraineeSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
});

export type Trainee = z.infer<typeof TraineeSchema>;
