import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import NextLink from "next/link";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import { getBaseUrl } from "@/utils/get-base-url";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { AvatarIconAndName } from "@/features/trainee/avatar-icon-and-name/avatar-icon-and-name";

import type { NextPageWithLayout } from "../_app.page";
import type { Exercise } from "@/features/exercise/exercise";
import type { Muscle } from "@/features/muscle/muscle";
import type { FC, MouseEventHandler, ReactElement } from "react";

const SettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>設定 | training-log</title>
      </Head>
      <RequireLogin>
        <Settings />
      </RequireLogin>
    </>
  );
};
SettingsPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation title="設定">{page}</HeaderNavigation>
    </FooterNavigation>
  );
};
export default SettingsPage;

const Settings: FC = () => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const musclesQuery = trpc.muscle.getAll.useQuery();

  const logout: ViewProps["logout"] = () => {
    signOut({
      callbackUrl: `${
        typeof window !== "undefined" ? window.location.origin : getBaseUrl()
      }${pagesPath.login.$url().pathname}`,
    });
  };

  switch (exercisesQuery.status) {
    case "loading":
      return <Loading description="種目データを取得しています" />;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  switch (musclesQuery.status) {
    case "loading":
      return <Loading description="部位データを取得しています" />;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  return (
    <SettingsView
      AvatarIconAndName={<AvatarIconAndName />}
      exercises={exercisesQuery.data}
      muscles={musclesQuery.data}
      logout={logout}
    />
  );
};

type ViewProps = {
  AvatarIconAndName: JSX.Element;
  muscles: Muscle[];
  exercises: Exercise[];
  logout: () => void;
};
const SettingsView: FC<ViewProps> = (props) => {
  const onClickLogout = useCallback<MouseEventHandler>(
    (_) => {
      props.logout();
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        <Center>{props.AvatarIconAndName}</Center>
        <Stack direction="row">
          <Heading as="h2" size="md">
            種目({props.exercises.length})
          </Heading>
          <Spacer />
          <Button as={NextLink} href={pagesPath.settings.exercises.$url()}>
            <ChevronRightIcon />
          </Button>
        </Stack>
        <List height="3xs" overflowY="scroll">
          {props.exercises.map((exercise) => {
            return <ListItem key={exercise.id}>{exercise.name}</ListItem>;
          })}
        </List>
        <Stack direction="row">
          <Heading as="h2" size="md">
            部位({props.muscles.length})
          </Heading>
          <Spacer />
          <Button as={NextLink} href={pagesPath.settings.muscles.$url()}>
            <ChevronRightIcon />
          </Button>
        </Stack>
        <List height="3xs" overflowY="scroll">
          {props.muscles.map((muscle) => {
            return <ListItem key={muscle.id}>{muscle.name}</ListItem>;
          })}
        </List>
        <Button onClick={onClickLogout}>ログアウト</Button>
      </Stack>
    </Container>
  );
};
