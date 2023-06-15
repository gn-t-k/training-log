import { Container, Text } from "@chakra-ui/react";

import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { Loading } from "@/_ui/loading/loading";

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
      // Unauthenticated={<Redirect redirectTo={pagesPath.login.$url()} />}
      Unauthenticated={<Redirect redirectTo={pagesPath.$url()} />}
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
