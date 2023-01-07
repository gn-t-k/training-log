import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

import { trpc } from "@/libs/trpc/client/trpc";

import { Muscle } from "../muscle";
import { MuscleField, useMuscleForm } from "../use-muscle-form";

type Props = {
  onClose: () => void;
  isOpen: boolean;
};
export const RegisterMuscleModal: FC<Props> = (props) => {
  const util = trpc.useContext();
  const registerMuscleMutator = trpc.muscle.register.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      onClose();
    },
  });

  const { isOpen, onClose } = props;
  const muscles = util.muscle.getAll.getData() ?? [];
  const registerMuscle = (name: string): void => {
    registerMuscleMutator.mutate({ name });
  };
  const registerMuscleStatus = registerMuscleMutator.status;

  return (
    <RegisterMuscleModalView
      {...{
        isOpen,
        onClose,
        muscles,
        registerMuscle,
        registerMuscleStatus,
      }}
    />
  );
};

type ViewProps = {
  isOpen: boolean;
  onClose: () => void;
  muscles: Muscle[];
  registerMuscle: (name: string) => void;
  registerMuscleStatus: "idle" | "loading" | "success" | "error";
};
export const RegisterMuscleModalView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    setValue,
    formState: { errors },
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

  const onSubmit: SubmitHandler<MuscleField> = (formValue) => {
    const isSameNameMuscleExist = props.muscles.some(
      (muscle) => muscle.name === formValue.name
    );
    if (isSameNameMuscleExist) {
      setError("name", {
        type: "custom",
        message: `部位${formValue.name}はすでに登録されています`,
      });
      return;
    }

    props.registerMuscle(formValue.name);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>部位を登録する</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>部位の名前</FormLabel>
              <Input {...register("name")} />
              {!!errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isDisabled={props.registerMuscleStatus === "loading"}
            >
              {props.registerMuscleStatus === "loading" ? (
                <Spinner />
              ) : (
                "登録する"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
