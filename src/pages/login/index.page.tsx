import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MouseEventHandler, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

const Login: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const onClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    await signIn("google", {
      callbackUrl: `${window.location.origin}${
        pagesPath.logged_in.$url().pathname
      }`,
    });
  };
  useEffect(() => {
    if (session.status === "authenticated") {
      router.push(pagesPath.logged_in.$url());
    }
  }, [router, session.status]);

  return (
    <div>
      <button {...{ onClick }}>ログイン</button>
    </div>
  );
};
export default Login;
