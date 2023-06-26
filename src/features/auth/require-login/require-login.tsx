import { Container, Text } from "@chakra-ui/react";

import { pagesPath } from "@/libs/pathpida/$path";

import { Loading } from "@/ui/loading/loading";

import { Redirect } from "@/features/navigation/redirect/redirect";

import { SessionContextProvider } from "../session-context/session-context";

import type { FC, ReactNode } from "react";

// import { TraineeStateManager } from "@/libs/recoil/trainee";

type Props = {
  children: ReactNode;
};
export const RequireLogin: FC<Props> = ({ children }) => {
  return (
    <SessionContextProvider
      Loading={
        <Container>
          <Loading description="認証情報を取得しています" />
        </Container>
      }
      Failure={
        <Container>
          <Failure />
        </Container>
      }
      Unauthenticated={<Redirect redirectTo={pagesPath.login.$url()} />}
    >
      {/* <TraineeStateManager /> */}
      {children}
    </SessionContextProvider>
  );
};

const Failure: FC = () => {
  // TODO
  return <Text>セッション情報の取得に失敗しました</Text>;
};
