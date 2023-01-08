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
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FC, MouseEventHandler, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

import { trpc } from "@/libs/trpc/client/trpc";

import { MutationState } from "@/utils/mutation-state";

import { Muscle } from "../muscle";
import { MuscleField, useMuscleForm } from "../use-muscle-form";

type Props = {
  onClose: () => void;
} & (
  | {
      isOpen: true;
      muscle: Muscle;
    }
  | {
      isOpen: false;
    }
);
export const EditMuscleModal: FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const util = trpc.useContext();
  const registeredMuscles = util.muscle.getAll.getData() ?? [];
  const updateMuscleMutator = trpc.muscle.updateName.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      onClose();
    },
  });
  const deleteMuscleMutator = trpc.muscle.delete.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      onClose();
    },
  });
  const updateMuscleStatus = updateMuscleMutator.status;
  const deleteMuscleStatus = deleteMuscleMutator.status;
  const args = isOpen
    ? {
        isOpen,
        muscle: props.muscle,
      }
    : {
        isOpen,
      };
  const updateMuscleName = (props: { id: string; name: string }): void => {
    updateMuscleMutator.mutate({ id: props.id, name: props.name });
  };
  const deleteMuscle = (id: string): void => {
    deleteMuscleMutator.mutate({ id });
  };

  return (
    <EditMuscleModalView
      {...{
        onClose,
        updateMuscleStatus,
        deleteMuscleStatus,
        registeredMuscles,
        updateMuscleName,
        deleteMuscle,
      }}
      {...args}
    />
  );
};

type ViewProps = {
  onClose: () => void;
  updateMuscleStatus: MutationState;
  deleteMuscleStatus: MutationState;
  registeredMuscles: Muscle[];
  updateMuscleName: (props: { id: string; name: string }) => void;
  deleteMuscle: (id: string) => void;
} & (
  | {
      isOpen: true;
      muscle: Muscle;
    }
  | {
      isOpen: false;
    }
);
export const EditMuscleModalView: FC<ViewProps> = (props) => {
  const {
    getValues,
    setError,
    handleSubmit,
    formState: { errors },
    register,
  } = useMuscleForm({
    name: props.isOpen ? props.muscle.name : "",
  });
  const toast = useToast();

  useEffect(() => {
    switch (props.updateMuscleStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: `部位の名前を「${getValues().name}」に変更しました`,
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の名前の変更に失敗しました",
          status: "error",
        });
        return;
    }
  }, [getValues, props.updateMuscleStatus, toast]);

  useEffect(() => {
    switch (props.deleteMuscleStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: `部位「${getValues().name}」を削除しました`,
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
  }, [getValues, props.deleteMuscleStatus, toast]);

  const onSubmit: SubmitHandler<MuscleField> = (formValue) => {
    if (!props.isOpen) {
      return;
    }

    const isSameNameMuscleExist = props.registeredMuscles.some(
      (muscle) => muscle.name === formValue.name
    );
    if (isSameNameMuscleExist) {
      setError("name", {
        type: "custom",
        message: `部位「${formValue.name}」はすでに登録されています`,
      });
      return;
    }

    props.updateMuscleName({ id: props.muscle.id, name: formValue.name });
  };

  const onClickDelete: MouseEventHandler = (e) => {
    e.preventDefault();
    if (!props.isOpen) {
      return;
    }

    props.deleteMuscle(props.muscle.id);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>部位を編集</ModalHeader>
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
            <Stack direction="column">
              <Button
                type="submit"
                isDisabled={props.updateMuscleStatus === "loading"}
              >
                {props.updateMuscleStatus === "loading" ? (
                  <Spinner />
                ) : (
                  "変更を保存する"
                )}
              </Button>
              <Button
                onClick={onClickDelete}
                isDisabled={props.deleteMuscleStatus === "loading"}
              >
                {props.deleteMuscleStatus === "loading" ? (
                  <Spinner />
                ) : (
                  "部位を削除する"
                )}
              </Button>
            </Stack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
