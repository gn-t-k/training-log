import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useMuscleForm } from "@/features/muscle/use-muscle-form";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { Muscle } from "@/features/muscle/muscle";
import type { MuscleField } from "@/features/muscle/use-muscle-form";
import type { FC, ReactElement } from "react";
import type { SubmitHandler } from "react-hook-form";

const RegisterMusclePage: NextPageWithLayout = () => {
  const router = useRouter();
  const goToMusclesPage: Props["goToMusclesPage"] = () => {
    router.push(pagesPath.settings.muscles.$url());
  };

  return (
    <>
      <Head>
        <title>部位を登録する | training-log</title>
      </Head>
      <RequireLogin>
        <RegisterMuscle goToMusclesPage={goToMusclesPage} />
      </RequireLogin>
    </>
  );
};
RegisterMusclePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="部位を登録する"
        leftItem={
          <Button as={NextLink} href={pagesPath.settings.muscles.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
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
      registerMuscle={registerMuscle}
      registerMuscleStatus={registerMuscleMutation.status}
      registeredMuscles={registeredMuscles}
    />
  );
};

type ViewProps = {
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
    </Container>
  );
};
