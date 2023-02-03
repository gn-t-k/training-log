import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { MutationState } from "@/utils/mutation-state";

import type { Exercise } from "../exercise";
import type { FC, MouseEventHandler } from "react";

type Props = {
  exercise: Exercise;
};
export const DeleteExerciseButtonAndDialog: FC<Props> = (props) => {
  const router = useRouter();
  const util = trpc.useContext();
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      router.push(pagesPath.settings.exercises.$url());
    },
  });
  const deleteExercise = useCallback<ViewProps["deleteExercise"]>(() => {
    deleteExerciseMutation.mutate({
      id: props.exercise.id,
    });
  }, [deleteExerciseMutation, props.exercise.id]);

  return (
    <DeleteExerciseButtonAndDialogView
      exercise={props.exercise}
      deleteExercise={deleteExercise}
      deleteExerciseStatus={deleteExerciseMutation.status}
    />
  );
};

type ViewProps = {
  exercise: Exercise;
  deleteExercise: () => void;
  deleteExerciseStatus: MutationState;
};
export const DeleteExerciseButtonAndDialogView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  useEffect(() => {
    switch (props.deleteExerciseStatus) {
      case "success":
        toast({
          title: "種目を削除しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "種目の削除に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [onClose, props.deleteExerciseStatus, toast]);
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );
  const onClickDelete = useCallback<MouseEventHandler>(
    (_) => {
      props.deleteExercise();
    },
    [props]
  );
  const onClickCancel = useCallback<MouseEventHandler>(
    (_) => {
      onClose();
    },
    [onClose]
  );
  const isProcessing = props.deleteExerciseStatus === "loading";

  return (
    <Stack direction="column">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>種目を削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            種目「{props.exercise.name}
            」を削除しますか？過去のトレーニング記録からも削除されます。
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClickDelete}
              isLoading={isProcessing}
              isDisabled={isProcessing}
              mr={4}
              colorScheme="red"
            >
              種目を削除する
            </Button>
            <Button
              onClick={onClickCancel}
              isDisabled={isProcessing}
              variant="ghost"
            >
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button onClick={onClickButton}>種目を削除</Button>
    </Stack>
  );
};
