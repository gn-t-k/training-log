import { Button, Container, Stack, Text } from "@chakra-ui/react";
import { getMonth, getYear } from "date-fns";
import { signOut } from "next-auth/react";
import NextLink from "next/link";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";

import type { NextPageWithLayout } from "./_app.page";
import type { FC, MouseEventHandler, ReactElement } from "react";

const IndexPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Index />
    </RequireLogin>
  );
};
IndexPage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
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
        <NextLink href={pagesPath.trainings.$url()}>トレーニング</NextLink>
        <NextLink href={pagesPath.muscles.$url()}>部位</NextLink>
        <NextLink href={pagesPath.exercises.$url()}>種目</NextLink>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Text>テスト</Text>
        <Button onClick={onClickLogout}>ログアウト</Button>
      </Stack>
    </Container>
  );
};
