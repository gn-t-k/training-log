import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

import { trpc } from "@/_libs/trpc/client/trpc";

import type { Trainee } from "@/_features/trainee/trainee";
import type { FC } from "react";

type TraineeState = {
  trainee: Trainee | null;
};
const traineeAtom = atom<TraineeState>({
  key: "trainee",
  default: {
    trainee: null,
  },
});

type UseTraineeState = () => TraineeState;
export const useTraineeState: UseTraineeState = () => {
  return useRecoilValue(traineeAtom);
};

type UseSetTraineeState = () => {
  login: Login;
  logout: Logout;
};
type Login = (trainee: Trainee) => void;
type Logout = () => void;
const useSetTraineeState: UseSetTraineeState = () => {
  const setState = useSetRecoilState(traineeAtom);

  const login = useCallback<Login>(
    (trainee) => {
      setState({ trainee });
    },
    [setState]
  );
  const logout = useCallback<Logout>(() => {
    setState({ trainee: null });
  }, [setState]);

  return {
    login,
    logout,
  };
};

export const TraineeStateManager: FC = () => {
  const session = useSession();
  const { trainee } = useTraineeState();
  const traineeQuery = trpc.trainee.getBySession.useQuery();
  const { login, logout } = useSetTraineeState();

  useEffect(() => {
    let ignore = false;

    if (
      !ignore &&
      session.status === "authenticated" &&
      trainee === null &&
      traineeQuery.data
    ) {
      login(traineeQuery.data);
    }

    if (!ignore && session.status === "unauthenticated") {
      logout();
    }

    return () => {
      ignore = true;
    };
  }, [login, logout, session.status, trainee, traineeQuery.data]);

  return null;
};
