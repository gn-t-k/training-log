import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";


import { useRegisterForm } from "./use-register-form";

import type { RegisterField } from "./use-register-form";
import type { MutationState } from "@/_utils/mutation-state";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

type Props = {
  register: Register;
  registerStatus: MutationState;
};
export const RegisterForm: FC<Props> = (props) => {
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
      <Stack direction="column" gap={8}>
        <Heading>登録フォーム</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" gap={4}>
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
              <FormHelperText>
                数字・小文字・大文字をそれぞれ1文字以上含めて、8文字以上で入力してください
              </FormHelperText>
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
              登録する
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

type Register = (props: {
  name: string;
  email: string;
  password: string;
}) => void;
