import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
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

import { getBaseUrl } from "@/utils/get-base-url";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { NextPageWithLayout } from "../_app.page";
import type { Exercise } from "@/features/exercise/exercise";
import type { Muscle } from "@/features/muscle/muscle";
import type { Trainee } from "@/features/trainee/trainee";
import type { FC, MouseEventHandler, ReactElement } from "react";

const SettingsPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Head>
        <title>設定 | training-log</title>
      </Head>
      <Settings />
    </RequireLogin>
  );
};
SettingsPage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
};
export default SettingsPage;

const Settings: FC = () => {
  const traineeQuery = trpc.trainee.getBySession.useQuery();
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const musclesQuery = trpc.muscle.getAll.useQuery();

  const logout: ViewProps["logout"] = () => {
    signOut({
      callbackUrl: `${
        typeof window !== "undefined" ? window.location.origin : getBaseUrl()
      }${pagesPath.login.$url().pathname}`,
    });
  };

  switch (traineeQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニー情報を取得中</p>;
    case "error":
      // TODO
      return <p>トレーニー情報の取得に失敗しました</p>;
  }

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  return traineeQuery.data === null ? (
    <Redirect redirectTo={pagesPath.onboarding.$url()} />
  ) : (
    <SettingsView
      trainee={traineeQuery.data}
      exercises={exercisesQuery.data}
      muscles={musclesQuery.data}
      logout={logout}
    />
  );
};

type ViewProps = {
  trainee: Trainee;
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
        <Heading as="h1" size="xl">
          設定
        </Heading>
        <Flex justifyContent="center">
          <Stack direction="column">
            <Image
              src={props.trainee.image}
              alt={props.trainee.name}
              borderRadius="full"
              boxSize="48px"
              alignSelf="center"
            />
            <span>{props.trainee.name}</span>
          </Stack>
        </Flex>
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
