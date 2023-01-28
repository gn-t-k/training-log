import { Container, Text } from "@chakra-ui/react";

import { pagesPath } from "@/libs/pathpida/$path";

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
          <Loading />
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

const Loading: FC = () => {
  // TODO
  return <Text>セッション情報を取得中</Text>;
};

const Failure: FC = () => {
  // TODO
  return <Text>セッション情報の取得に失敗しました</Text>;
};
