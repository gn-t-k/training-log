import { NextPage } from "next";
import { FC } from "react";

import { useTraineeState } from "@/libs/recoil/trainee";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useSessionContext } from "@/features/auth/session-context/session-context";

const HelloContainer: NextPage = () => {
  return (
    <RequireLogin>
      <Hello />
    </RequireLogin>
  );
};
export default HelloContainer;

const Hello: FC = () => {
  const session = useSessionContext();
  const trainee = useTraineeState();

  return (
    <>
      <p>{JSON.stringify(session)}</p>
      <p>{JSON.stringify(trainee)}</p>
    </>
  );
};
