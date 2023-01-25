import { Button, Container, Stack } from "@chakra-ui/react";
import { getMonth, getYear } from "date-fns";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

import type { NextPage } from "next";
import type { FC, MouseEventHandler} from "react";

const IndexPage: NextPage = () => {
  return (
    <RequireLogin>
      <Index />
    </RequireLogin>
  );
};
export default IndexPage;

const Index: FC = () => {
  const logout: ViewProps["logout"] = () => {
    signOut({
      callbackUrl: `${window.location.origin}${
        pagesPath.login.$url().pathname
      }`,
    });
  };

  const today = new Date();
  trpc.training.getMonthlyTrainings.useQuery({
    year: getYear(today),
    month: getMonth(today),
  });
  trpc.exercise.getAll.useQuery();
  trpc.muscle.getAll.useQuery();

  return <IndexView logout={logout} />;
};

type ViewProps = {
  logout: () => void;
};
const IndexView: FC<ViewProps> = (props) => {
  const onClickLogout = useCallback<MouseEventHandler>(
    (_) => {
      props.logout();
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        <Link href={pagesPath.trainings.$url()}>トレーニング</Link>
        <Link href={pagesPath.muscles.$url()}>部位</Link>
        <Link href={pagesPath.exercises.$url()}>種目</Link>
        <Button onClick={onClickLogout}>ログアウト</Button>
      </Stack>
    </Container>
  );
};
