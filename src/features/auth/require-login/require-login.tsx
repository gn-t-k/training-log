import { FC, ReactNode } from "react";

import { TraineeStateManager } from "@/libs/recoil/trainee";

import { SessionContextProvider } from "../session-context/session-context";

type Props = {
  children: ReactNode;
};
export const RequireLogin: FC<Props> = ({ children }) => {
  return (
    <SessionContextProvider>
      <TraineeStateManager />
      {children}
    </SessionContextProvider>
  );
};
