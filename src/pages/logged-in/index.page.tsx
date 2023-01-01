import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

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

  return (
    <RequireLogin>
      <p>logged in</p>
      <button {...{ onClick }}>logout</button>
    </RequireLogin>
  );
};
export default LoggedIn;
