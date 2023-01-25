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
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Muscle } from "@/features/muscle/muscle";
import { MuscleField, useMuscleForm } from "@/features/muscle/use-muscle-form";

const RegisterMusclePage: NextPage = () => {
  const router = useRouter();
  const goToMusclesPage: Props["goToMusclesPage"] = () => {
    router.push(pagesPath.muscles.$url());
  };

  return (
    <RequireLogin>
      <RegisterMuscle goToMusclesPage={goToMusclesPage} />
    </RequireLogin>
  );
};
export default RegisterMusclePage;

type Props = {
  goToMusclesPage: () => void;
};
const RegisterMuscle: FC<Props> = (props) => {
  const util = trpc.useContext();
  const registerMuscleMutation = trpc.muscle.register.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      props.goToMusclesPage();
    },
  });

  const registerMuscle = useCallback<ViewProps["registerMuscle"]>(
    (props) => {
      registerMuscleMutation.mutate(props);
    },
    [registerMuscleMutation]
  );
  const registeredMuscles = util.muscle.getAll.getData() ?? [];

  return (
    <RegisterMuscleView
      goToMusclesPage={props.goToMusclesPage}
      registerMuscle={registerMuscle}
      registerMuscleStatus={registerMuscleMutation.status}
      registeredMuscles={registeredMuscles}
    />
  );
};

type ViewProps = {
  goToMusclesPage: () => void;
  registerMuscle: (muscle: { name: string }) => void;
  registerMuscleStatus: MutationState;
  registeredMuscles: Muscle[];
};
const RegisterMuscleView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    getValues,
    setValue,
  } = useMuscleForm();
  const toast = useToast();

  useEffect(() => {
    switch (props.registerMuscleStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: `部位「${getValues().name}」を登録しました`,
          status: "success",
        });
        setValue("name", "");
        return;
      case "error":
        toast({
          title: "部位の登録に失敗しました",
          status: "error",
        });
        return;
    }
  }, [getValues, props.registerMuscleStatus, setValue, toast]);

  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToMusclesPage();
    },
    [props]
  );
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

      props.registerMuscle({
        name: fieldValues.name,
      });
    },
    [props, setError]
  );

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={onClickBack}>
            <ChevronLeftIcon />
          </Button>
          <Heading>部位を登録する</Heading>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">部位の名前</FormLabel>
              <Input id="name" {...register("name")} />
              {!!errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="submit"
              isLoading={props.registerMuscleStatus === "loading"}
              isDisabled={props.registerMuscleStatus === "loading"}
            >
              登録する
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};
