import { Button, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { Redirect } from "@/features/navigation/redirect/redirect";

import type { NextPage } from "next";
import type { MouseEventHandler, FC } from "react";

const Login: NextPage = () => {
  const session = useSession();

  const login: ViewProps["login"] = async () => {
    await signIn("google", {
      callbackUrl: `${window.location.origin}${
        pagesPath.logged_in.$url().pathname
      }`,
    });
  };

  return <LoginView sessionStatus={session.status} login={login} />;
};
export default Login;

type ViewProps = {
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
  login: () => Promise<void>;
};
const LoginView: FC<ViewProps> = (props) => {
  const onClickLogin = useCallback<MouseEventHandler>(
    async (_) => {
      await props.login();
    },
    [props]
  );

  switch (props.sessionStatus) {
    case "loading":
      // TODO
      return <Text>セッション情報を確認中</Text>;
    case "authenticated":
      return <Redirect redirectTo={pagesPath.logged_in.$url()} />;
    case "unauthenticated":
      return <Button onClick={onClickLogin}>ログイン</Button>;
  }
};
