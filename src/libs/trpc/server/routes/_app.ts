import { router } from "../trpc";
import { muscleRouter } from "./muscle";
import { traineeRouter } from "./trainee";

export const appRouter = router({
  trainee: traineeRouter,
  muscle: muscleRouter,
});

export type AppRouter = typeof appRouter;
