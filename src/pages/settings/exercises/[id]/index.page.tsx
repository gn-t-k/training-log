import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useExerciseForm } from "@/features/exercise/use-exercise-form";
import { useGetExerciseId } from "@/features/exercise/use-get-exercise-id";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { Exercise } from "@/features/exercise/exercise";
import type { ExerciseField } from "@/features/exercise/use-exercise-form";
import type { Muscle } from "@/features/muscle/muscle";
import type { FC, MouseEventHandler, ReactElement } from "react";
import type { SubmitHandler } from "react-hook-form";

const ExercisePage: NextPageWithLayout = () => {
  const id = useGetExerciseId();
  const router = useRouter();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.settings.exercises.$url()} />;
  }

  const goToExercisesPage: Props["goToExercisesPage"] = () => {
    router.push(pagesPath.settings.exercises.$url());
  };

  return (
    <RequireLogin>
      <Head>
        <title>種目を編集する | training-log</title>
      </Head>
      <ExerciseComponent id={id} goToExercisesPage={goToExercisesPage} />
    </RequireLogin>
  );
};
ExercisePage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
};
export default ExercisePage;

type Props = {
  id: string;
  goToExercisesPage: () => void;
};
const ExerciseComponent: FC<Props> = (props) => {
  const util = trpc.useContext();
  const exerciseQuery = trpc.exercise.getById.useQuery({
    id: props.id,
  });
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const updateExerciseMutation = trpc.exercise.update.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      props.goToExercisesPage();
    },
  });
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      props.goToExercisesPage();
    },
  });

  const updateExercise: ViewProps["updateExercise"] = (props) => {
    updateExerciseMutation.mutate(props);
  };
  const deleteExercise: ViewProps["deleteExercise"] = (id) => {
    deleteExerciseMutation.mutate({ id });
  };

  switch (exerciseQuery.status) {
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

  return (
    <ExerciseView
      exercise={exerciseQuery.data}
      targets={musclesQuery.data}
      updateExercise={updateExercise}
      deleteExercise={deleteExercise}
      updateExerciseStatus={updateExerciseMutation.status}
      deleteExerciseStatus={deleteExerciseMutation.status}
    />
  );
};

type ViewProps = {
  exercise: Exercise;
  targets: Muscle[];
  updateExercise: (props: { before: Exercise; after: Exercise }) => void;
  deleteExercise: (id: string) => void;
  updateExerciseStatus: MutationState;
  deleteExerciseStatus: MutationState;
};
export const ExerciseView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useExerciseForm({
    name: props.exercise.name,
    muscleIds: props.exercise.targets.map((t) => t.id),
  });
  const toast = useToast();
  useEffect(() => {
    switch (props.updateExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目の変更を保存しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の変更の保存に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.updateExerciseStatus, toast]);
  useEffect(() => {
    switch (props.deleteExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目を削除しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の削除に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.deleteExerciseStatus, toast]);

  const onSubmit: SubmitHandler<ExerciseField> = (formValue) => {
    const targets = formValue.muscleIds.flatMap((id) => {
      const target = props.targets.find((t) => t.id === id);

      return target ? [target] : [];
    });
    props.updateExercise({
      before: props.exercise,
      after: {
        id: props.exercise.id,
        name: formValue.name,
        targets,
      },
    });
  };
  const onClickDelete: MouseEventHandler = (e) => {
    e.preventDefault();

    props.deleteExercise(props.exercise.id);
  };
  const isLoading =
    props.updateExerciseStatus === "loading" ||
    props.deleteExerciseStatus === "loading";

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.settings.exercises.$url()}>
            <ChevronLeftIcon />
          </Button>
          <Heading>種目を編集</Heading>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column">
            <FormControl isInvalid={!!errors.name} isDisabled={isLoading}>
              <FormLabel>種目の名前</FormLabel>
              <Input {...register("name")} />
              {!!errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.muscleIds} isDisabled={isLoading}>
              <FormLabel>この種目で鍛えられる部位</FormLabel>
              <Controller
                control={control}
                name="muscleIds"
                render={({ field }): ReactElement => (
                  // FIXME: forwardRef使えエラーが出る
                  <CheckboxGroup {...field}>
                    <Stack direction="column">
                      {props.targets.map((target) => (
                        <Checkbox key={target.id} value={target.id}>
                          {target.name}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                )}
              />
              {!!errors.muscleIds && (
                <FormErrorMessage>{errors.muscleIds.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit" isDisabled={isLoading}>
              {isLoading ? <Spinner /> : "変更を保存"}
            </Button>
            <Button onClick={onClickDelete} isDisabled={isLoading}>
              {isLoading ? <Spinner /> : "種目を削除"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
