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
      return <p>loading</p>;
    case "authenticated":
      return (
        <div>
          <p>session: {JSON.stringify(session.data)}</p>
          <button onClick={onClickLogout}>logout</button>
        </div>
      );
    case "unauthenticated":
      return <Link href={pagesPath.login.$url()}>ログインページ</Link>;
  }
};

export default IndexPage;
