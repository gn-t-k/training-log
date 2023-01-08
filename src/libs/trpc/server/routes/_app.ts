import { router } from "../trpc";
import { exerciseRouter } from "./exercise";
import { muscleRouter } from "./muscle";
import { traineeRouter } from "./trainee";

export const appRouter = router({
  trainee: traineeRouter,
  muscle: muscleRouter,
  exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
