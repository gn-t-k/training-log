import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Divider,
  Heading,
  List,
  Spacer,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Exercise } from "@/features/exercise/exercise";

const Exercises: NextPage = () => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const router = useRouter();

  const goToRegisterPage: ViewProps["goToRegisterPage"] = (e) => {
    e.preventDefault();

    router.push(pagesPath.exercises.register.$url());
  };
  const goToEditPageHOF: ViewProps["goToEditPageHOF"] = (id) => (e) => {
    e.preventDefault();

    router.push(pagesPath.exercises._id(id).$url());
  };

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "success":
      return (
        <ExercisesView
          exercises={exercisesQuery.data}
          goToRegisterPage={goToRegisterPage}
          goToEditPageHOF={goToEditPageHOF}
        />
      );
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }
};
export default Exercises;

type ViewProps = {
  exercises: Exercise[];
  goToRegisterPage: MouseEventHandler;
  goToEditPageHOF: (id: string) => MouseEventHandler;
};
const ExercisesView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="row">
        <Button>
          <ChevronLeftIcon />
        </Button>
        <Spacer />
        <Heading>種目</Heading>
        <Spacer />
        <Button onClick={props.goToRegisterPage}>
          <AddIcon />
        </Button>
      </Stack>
      <Stack direction="column">
        <UnorderedList>
          {props.exercises.map((exercise) => {
            const goToEditPage = props.goToEditPageHOF(exercise.id);

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
                    <Button onClick={goToEditPage}>
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
