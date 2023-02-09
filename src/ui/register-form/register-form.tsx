import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { useRegisterForm } from "./use-register-form";

import type { RegisterField } from "./use-register-form";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

type Register = (props: {
  name: string;
  email: string;
  password: string;
}) => void;

export const RegisterForm: FC = () => {
  const [registerStatus, setRegisterStatus] = useState<MutationState>("idle");
  const register: Register = (props) => {
    (async (): Promise<void> => {
      setRegisterStatus("loading");
      await sleep(1000);
      console.info(props);
      setRegisterStatus("success");
    })();
  };

  return (
    <RegisterFormView register={register} registerStatus={registerStatus} />
  );
};

type ViewProps = {
  register: Register;
  registerStatus: MutationState;
};
export const RegisterFormView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm();
  const toast = useToast();
  const onSubmit = useCallback<SubmitHandler<RegisterField>>(
    (fieldValues) => {
      props.register({
        name: fieldValues.name,
        email: fieldValues.email,
        password: fieldValues.password,
      });
    },
    [props]
  );

  useEffect(() => {
    switch (props.registerStatus) {
      case "success":
        toast({
          title: "登録しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "登録に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [props.registerStatus, toast]);

  return (
    <Container>
      <Heading>登録フォーム</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">名前</FormLabel>
          <Input type="text" id="name" {...register("name")} />
          {!!errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input type="email" id="email" {...register("email")} />
          {!!errors.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <Input type="password" id="password" {...register("password")} />
          {!!errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          isLoading={props.registerStatus === "loading"}
          isDisabled={props.registerStatus === "loading"}
        >
          登録
        </Button>
      </form>
    </Container>
  );
};
