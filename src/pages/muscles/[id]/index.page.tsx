import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Redirect } from "@/ui/redirect/redirect";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Muscle } from "@/features/muscle/muscle";
import { useGetMuscleId } from "@/features/muscle/use-get-muscle-id";
import { useMuscleForm } from "@/features/muscle/use-muscle-form";

import type { MuscleField } from "@/features/muscle/use-muscle-form";
import type { NextPage } from "next";
import type { FC, MouseEventHandler } from "react";
import type { SubmitHandler } from "react-hook-form";

const MusclePage: NextPage = () => {
  const id = useGetMuscleId();
  const router = useRouter();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.muscles.$url()} />;
  }

  const goToMusclesPage: Props["goToMusclesPage"] = () => {
    router.push(pagesPath.muscles.$url());
  };

  return (
    <RequireLogin>
      <Muscle id={id} goToMusclesPage={goToMusclesPage} />
    </RequireLogin>
  );
};
export default MusclePage;

type Props = {
  id: string;
  goToMusclesPage: () => void;
};
const Muscle: FC<Props> = (props) => {
  const util = trpc.useContext();
  const muscleQuery = trpc.muscle.getById.useQuery({ id: props.id });
  const registeredMuscles = util.muscle.getAll.getData() ?? [];
  const updateMuscleNameMutation = trpc.muscle.updateName.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      props.goToMusclesPage();
    },
  });
  const deleteMuscleMutation = trpc.muscle.delete.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      props.goToMusclesPage();
    },
  });

  switch (muscleQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  const updateMuscle: ViewProps["updateMuscle"] = (props) => {
    updateMuscleNameMutation.mutate({
      id: muscleQuery.data.id,
      name: props.name,
    });
  };
  const deleteMuscle: ViewProps["deleteMuscle"] = () => {
    deleteMuscleMutation.mutate({
      id: muscleQuery.data.id,
    });
  };

  return (
    <MuscleView
      muscle={muscleQuery.data}
      registeredMuscles={registeredMuscles}
      updateMuscle={updateMuscle}
      deleteMuscle={deleteMuscle}
      updateMuscleStatus={updateMuscleNameMutation.status}
      deleteMuscleStatus={deleteMuscleMutation.status}
    />
  );
};

type ViewProps = {
  muscle: Muscle;
  registeredMuscles: Muscle[];
  updateMuscle: (props: Muscle) => void;
  deleteMuscle: () => void;
  updateMuscleStatus: MutationState;
  deleteMuscleStatus: MutationState;
};
const MuscleView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useMuscleForm({
    name: props.muscle.name,
  });
  const toast = useToast();

  useEffect(() => {
    switch (props.updateMuscleStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "部位の変更を保存しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の変更の保存に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.updateMuscleStatus, toast]);
  useEffect(() => {
    switch (props.deleteMuscleStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "部位を削除しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の削除に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.deleteMuscleStatus, toast]);

  const onSubmit = useCallback<SubmitHandler<MuscleField>>(
    (fieldValues) => {
      const isSameNameMuscleExist = props.registeredMuscles.some(
        (muscle) => muscle.name === fieldValues.name
      );

      if (isSameNameMuscleExist) {
        setError("name", {
          type: "custom",
          message: `部位「${fieldValues.name}」はすでに登録されています`,
        });
        return;
      }

      props.updateMuscle({
        id: props.muscle.id,
        name: fieldValues.name,
      });
    },
    [props, setError]
  );
  const onClickDelete = useCallback<MouseEventHandler>(() => {
    props.deleteMuscle();
  }, [props]);

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.muscles.$url()}>
            <ChevronLeftIcon />
          </Button>
          <Heading>部位を編集</Heading>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">部位の名前</FormLabel>
              <Input {...register("name")} id="name" />
              {!!errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              isLoading={props.updateMuscleStatus === "loading"}
              isDisabled={
                props.updateMuscleStatus === "loading" ||
                props.deleteMuscleStatus === "loading" ||
                !isValid
              }
            >
              変更を保存
            </Button>
            <Button
              onClick={onClickDelete}
              isLoading={props.deleteMuscleStatus === "loading"}
              isDisabled={
                props.updateMuscleStatus === "loading" ||
                props.deleteMuscleStatus === "loading"
              }
            >
              種目を削除
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
