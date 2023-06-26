import { Button } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { Loading } from "@/ui/loading/loading";

import { getBaseUrl } from "@/utils/get-base-url";

import { Redirect } from "@/features/navigation/redirect/redirect";

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
      }${pagesPath.logged_in.$url().pathname}`,
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
      return <Redirect redirectTo={pagesPath.logged_in.$url()} />;
    case "unauthenticated":
      // TODO
      return <Button onClick={onClickLogin}>ログイン</Button>;
  }
};
