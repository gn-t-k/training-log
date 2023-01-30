import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Spacer,
  Stack,
  StackDivider,
  Tag,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { Exercise } from "@/features/exercise/exercise";
import type { FC } from "react";

export const ExerciseList: FC = () => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
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
      {props.exercises.map((exercise) => {
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
              href={pagesPath.settings.exercises._id(exercise.id).$url()}
            >
              <ChevronRightIcon />
            </Button>
          </Stack>
        );
      })}
    </Stack>
  );
};
