import { NextPage } from "next";
import { FC } from "react";

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

  return <p>{JSON.stringify(session)}</p>;
};
