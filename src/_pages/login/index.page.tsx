import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useCallback } from "react";

import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { Loading } from "@/_ui/loading/loading";
import { getBaseUrl } from "@/_utils/get-base-url";


import type { NextPage } from "next";
import type { MouseEventHandler, FC } from "react";

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ログイン | training-log</title>
      </Head>
      <Login />
    </>
  );
};
export default LoginPage;

const Login: FC = () => {
  const session = useSession();

  const login: ViewProps["login"] = async () => {
    await signIn("google", {
      callbackUrl: `${
        typeof window !== "undefined" ? window.location.origin : getBaseUrl()
        // }${pagesPath.logged_in.$url().pathname}`,
      }${pagesPath.$url().pathname}`,
    });
  };

  return <LoginView sessionStatus={session.status} login={login} />;
};

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
      return <Loading description="認証情報を確認しています" />;
    case "authenticated":
      // return <Redirect redirectTo={pagesPath.logged_in.$url()} />;
      return <Redirect redirectTo={pagesPath.$url()} />;
    case "unauthenticated":
      // TODO
      return <Button onClick={onClickLogin}>ログイン</Button>;
  }
};
