import { z } from "zod";

import { muscleSchema } from "../muscle/muscle";

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  targets: z.array(muscleSchema),
});

export type Exercise = z.infer<typeof exerciseSchema>;
