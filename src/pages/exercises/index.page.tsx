import {
  Button,
  Container,
  List,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { MouseEventHandler } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

const Exercises: NextPage = () => {
  const util = trpc.useContext();
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const registerExerciseMutation = trpc.exercise.register.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
    },
  });
  const updateExerciseNameMutation = trpc.exercise.updateName.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
    },
  });
  const updateExerciseTargetMutation = trpc.exercise.updateTargets.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
    },
  });
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
    },
  });

  const onClickRegister: MouseEventHandler = (e) => {
    e.preventDefault();

    registerExerciseMutation.mutate({
      name: `種目${new Date()}`,
      targets: [{ id: "01GP4JSSDVEXC6RR701TGPYR3N", name: "上腕二頭筋" }],
    });
  };
  const onClickUpdateNameHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();

      updateExerciseNameMutation.mutate({ id, name: `種目${new Date()}` });
    };
  const onClickUpdateTargetsHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();

      updateExerciseTargetMutation.mutate({
        id,
        targets: [{ id: "01GP7D1JQKK0SZJE2E3CGVQA80", name: "上腕三頭筋" }],
      });
    };
  const onClickDeleteHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();

      deleteExerciseMutation.mutate({ id });
    };

  return (
    <Container>
      <Stack direction="column">
        <Button onClick={onClickRegister}>登録</Button>
        {exercisesQuery.status === "success" && (
          <UnorderedList>
            {exercisesQuery.data.map((exercise) => (
              <List key={exercise.id}>
                <Text>{exercise.name}</Text>
                <Text>{exercise.targets.map((target) => target.name)}</Text>
                <Button onClick={onClickUpdateNameHOF(exercise.id)}>
                  名前を更新
                </Button>
                <Button onClick={onClickUpdateTargetsHOF(exercise.id)}>
                  種目を更新
                </Button>
                <Button onClick={onClickDeleteHOF(exercise.id)}>削除</Button>
              </List>
            ))}
          </UnorderedList>
        )}
      </Stack>
    </Container>
  );
};
export default Exercises;
