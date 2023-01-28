import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Divider,
  List,
  Spacer,
  Spinner,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { NextPageWithLayout } from "../../_app.page";
import type { Exercise } from "@/features/exercise/exercise";
import type { FC, ReactElement } from "react";

const ExercisesPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Head>
        <title>種目 | training-log</title>
      </Head>
      <Exercises />
    </RequireLogin>
  );
};
ExercisesPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="種目"
        leftItem={
          <Button as={NextLink} href={pagesPath.settings.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
        rightItem={
          <Button
            as={NextLink}
            href={pagesPath.settings.exercises.register.$url()}
          >
            <AddIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default ExercisesPage;

const Exercises: FC = () => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "success":
      return (
        <ExercisesView
          exercises={exercisesQuery.data}
          isFetching={exercisesQuery.isFetching}
        />
      );
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  exercises: Exercise[];
  isFetching: boolean;
};
const ExercisesView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        {props.isFetching && <Spinner />}
        <UnorderedList>
          {props.exercises.map((exercise) => {
            return (
              <List key={exercise.id}>
                <Stack direction="column">
                  <Stack direction="row">
                    <Stack direction="column">
                      <Text>{exercise.name}</Text>
                      <Text>
                        {exercise.targets.map((target) => target.name)}
                      </Text>
                    </Stack>
                    <Spacer />
                    <Button
                      as={NextLink}
                      href={pagesPath.settings.exercises
                        ._id(exercise.id)
                        .$url()}
                    >
                      <ChevronRightIcon />
                    </Button>
                  </Stack>
                  <Divider />
                </Stack>
              </List>
            );
          })}
        </UnorderedList>
      </Stack>
    </Container>
  );
};
