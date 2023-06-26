import { router } from "../trpc";
import { exerciseRouter } from "./exercise";
import { muscleRouter } from "./muscle";
import { traineeRouter } from "./trainee";
import { trainingRouter } from "./training";

export const appRouter = router({
  trainee: traineeRouter,
  muscle: muscleRouter,
  exercise: exerciseRouter,
  training: trainingRouter,
});

export type AppRouter = typeof appRouter;
