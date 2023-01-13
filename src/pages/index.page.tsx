import { Button, Container, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

const IndexPage: NextPage = () => {
  const session = useSession();
  const onClickLogout: MouseEventHandler = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}${
        pagesPath.login.$url().pathname
      }`,
    });
  };

  switch (session.status) {
    case "loading":
      // TODO
      return <p>セッション情報を取得中</p>;
    case "authenticated":
      return (
        <Container>
          <Stack direction="column">
            <Link href={pagesPath.muscles.$url()}>部位</Link>
            <Link href={pagesPath.exercises.$url()}>種目</Link>
            <Button onClick={onClickLogout}>ログアウト</Button>
          </Stack>
        </Container>
      );
    case "unauthenticated":
      return <Link href={pagesPath.login.$url()}>ログインページ</Link>;
  }
};

export default IndexPage;
