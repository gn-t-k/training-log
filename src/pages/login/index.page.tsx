import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import type { NextPage } from "next";
import type { MouseEventHandler} from "react";

const Login: NextPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    let ignore = false;

    if (!ignore && session.status === "authenticated") {
      router.push(pagesPath.logged_in.$url());
    }

    return () => {
      ignore = true;
    };
  }, [router, session.status]);

  const onClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    await signIn("google", {
      callbackUrl: `${window.location.origin}${
        pagesPath.logged_in.$url().pathname
      }`,
    });
  };

  return (
    <div>
      <button {...{ onClick }}>ログイン</button>
    </div>
  );
};
export default Login;
