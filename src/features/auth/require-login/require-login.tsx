import { SessionContextProvider } from "../session-context/session-context";

import type { FC, ReactNode } from "react";

// import { TraineeStateManager } from "@/libs/recoil/trainee";


type Props = {
  children: ReactNode;
};
export const RequireLogin: FC<Props> = ({ children }) => {
  return (
    <SessionContextProvider>
      {/* <TraineeStateManager /> */}
      {children}
    </SessionContextProvider>
  );
};
