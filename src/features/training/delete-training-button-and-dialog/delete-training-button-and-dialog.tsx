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

import type { Training } from "../training";
import type { FC, MouseEventHandler } from "react";

type Props = {
  training: Training;
};
export const DeleteTrainingButtonAndDialog: FC<Props> = (props) => {
  const router = useRouter();
  const util = trpc.useContext();
  const deleteTrainingMutation = trpc.training.delete.useMutation({
    onSuccess: () => {
      util.training.invalidate();
      router.push(pagesPath.trainings.$url());
    },
  });
  const deleteTraining = useCallback<ViewProps["deleteTraining"]>(() => {
    deleteTrainingMutation.mutate({
      id: props.training.id,
    });
  }, [deleteTrainingMutation, props.training.id]);

  return (
    <DeleteTrainingButtonAndDialogView
      deleteTraining={deleteTraining}
      deleteTrainingStatus={deleteTrainingMutation.status}
    />
  );
};

type ViewProps = {
  deleteTraining: () => void;
  deleteTrainingStatus: MutationState;
};
export const DeleteTrainingButtonAndDialogView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  useEffect(() => {
    switch (props.deleteTrainingStatus) {
      case "success":
        toast({
          title: "トレーニング記録を削除しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "トレーニング記録の削除に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [onClose, props.deleteTrainingStatus, toast]);
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );
  const onClickDelete = useCallback<MouseEventHandler>(
    (_) => {
      props.deleteTraining();
    },
    [props]
  );
  const onClickCancel = useCallback<MouseEventHandler>(
    (_) => {
      onClose();
    },
    [onClose]
  );
  const isProcessing = props.deleteTrainingStatus === "loading";

  return (
    <Stack direction="column">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>トレーニング記録を削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>トレーニング記録を削除しますか？</ModalBody>
          <ModalFooter>
            <Button
              onClick={onClickDelete}
              isLoading={isProcessing}
              isDisabled={isProcessing}
              mr={4}
              colorScheme="red"
            >
              トレーニング記録を削除する
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
      <Button onClick={onClickButton}>トレーニング記録を削除</Button>
    </Stack>
  );
};
