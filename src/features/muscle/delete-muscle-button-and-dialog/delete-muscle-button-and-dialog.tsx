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

import type { Muscle } from "../muscle";
import type { FC, MouseEventHandler } from "react";

type Props = {
  muscle: Muscle;
};
export const DeleteMuscleButtonAndDialog: FC<Props> = (props) => {
  const router = useRouter();
  const util = trpc.useContext();
  const deleteMuscleMutation = trpc.muscle.delete.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      router.push(pagesPath.settings.muscles.$url());
    },
  });
  const deleteMuscle = useCallback<ViewProps["deleteMuscle"]>(() => {
    deleteMuscleMutation.mutate({
      id: props.muscle.id,
    });
  }, [deleteMuscleMutation, props.muscle.id]);

  return (
    <DeleteMuscleButtonAndDialogView
      muscle={props.muscle}
      deleteMuscle={deleteMuscle}
      deleteMuscleStatus={deleteMuscleMutation.status}
    />
  );
};

type ViewProps = {
  muscle: Muscle;
  deleteMuscle: () => void;
  deleteMuscleStatus: MutationState;
};
export const DeleteMuscleButtonAndDialogView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  useEffect(() => {
    switch (props.deleteMuscleStatus) {
      case "success":
        toast({
          title: "部位を削除しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "部位の削除に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [onClose, props.deleteMuscleStatus, toast]);
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );
  const onClickDelete = useCallback<MouseEventHandler>(
    (_) => {
      props.deleteMuscle();
    },
    [props]
  );
  const onClickCancel = useCallback<MouseEventHandler>(
    (_) => {
      onClose();
    },
    [onClose]
  );
  const isProcessing = props.deleteMuscleStatus === "loading";

  return (
    <Stack direction="column">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>部位を削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            部位「{props.muscle.name}
            」を削除しますか？既存の種目からも削除されます。
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClickDelete}
              isLoading={isProcessing}
              isDisabled={isProcessing}
              mr={4}
              colorScheme="red"
            >
              部位を削除する
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
      <Button onClick={onClickButton}>部位を削除</Button>
    </Stack>
  );
};
