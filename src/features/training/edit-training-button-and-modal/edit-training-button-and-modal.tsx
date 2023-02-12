import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { UpdateTrainingForm } from "@/features/training/update-training-form/update-training-form";

import type { Training } from "@/features/training/training";
import type { FC, MouseEventHandler } from "react";

type Props = {
  training: Training;
};
export const EditTrainingButtonAndModal: FC<Props> = (props) => {
  return <EditTrainingButtonAndModalView training={props.training} />;
};

type ViewProps = {
  training: Training;
};
export const EditTrainingButtonAndModalView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>トレーニング記録を編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UpdateTrainingForm training={props.training} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button onClick={onClickButton}>トレーニング記録を編集</Button>
    </>
  );
};
