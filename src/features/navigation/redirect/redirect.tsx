import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { getBaseUrl } from "@/utils/get-base-url";

import type { FC } from "react";
import type { UrlObject } from "url";

type Props = {
  redirectTo: UrlObject;
};
export const Redirect: FC<Props> = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.replace(props.redirectTo);
  }, [props.redirectTo, router]);

  return <RedirectView redirectTo={props.redirectTo} />;
};

type ViewProps = {
  redirectTo: UrlObject;
};
export const RedirectView: FC<ViewProps> = (props) => {
  return (
    <Link href={props.redirectTo}>{`${
      window ? window.location.origin : getBaseUrl()
    }${props.redirectTo.pathname} に移動しています...`}</Link>
  );
};
