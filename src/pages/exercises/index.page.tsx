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
      // TODO
      console.log(id);
    };
  const onClickUpdateTargetsHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      // TODO
      console.log(id);
    };
  const onClickDeleteHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      // TODO
      console.log(id);
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
