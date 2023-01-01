import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

const LoggedIn: NextPage = () => {
  const onClick: MouseEventHandler = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}${
        pagesPath.login.$url().pathname
      }`,
    });
  };
  const hello = trpc.hello.useQuery({ text: "client" });

  return (
    <RequireLogin>
      <p>logged in</p>
      <p>{JSON.stringify(hello)}</p>
      <button {...{ onClick }}>logout</button>
    </RequireLogin>
  );
};
export default LoggedIn;
