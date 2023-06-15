import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Tag,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import type { Exercise } from "@/_features/exercise/exercise";
import type { FC } from "react";

export const ExerciseList: FC = () => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();

  switch (exercisesQuery.status) {
    case "loading":
      return <Loading description="種目データを取得しています" />;
    case "success":
      return <ExerciseListView exercises={exercisesQuery.data} />;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  exercises: Exercise[];
};
export const ExerciseListView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column" divider={<StackDivider />} spacing={4}>
      {props.exercises.length === 0 ? (
        <Stack direction="column">
          <Text>まだ種目が登録されていません</Text>
          <Text>
            {/* <NextLink href={pagesPath.settings.exercises.register.$url()}> */}
            <NextLink href={pagesPath.$url()}>種目を登録</NextLink>
            しましょう
          </Text>
        </Stack>
      ) : (
        props.exercises.map((exercise) => {
          return (
            <Stack key={exercise.id} direction="row">
              <Stack direction="column">
                <Heading size="sm">{exercise.name}</Heading>
                <Stack direction="row">
                  {exercise.targets.map((target) => {
                    return <Tag key={target.id}>{target.name}</Tag>;
                  })}
                </Stack>
              </Stack>
              <Spacer />
              <Button
                as={NextLink}
                // href={pagesPath.settings.exercises._id(exercise.id).$url()}
                href={pagesPath.$url()}
              >
                <ChevronRightIcon />
              </Button>
            </Stack>
          );
        })
      )}
    </Stack>
  );
};
