import { AddIcon } from "@chakra-ui/icons";
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

import { RegisterTrainingForm } from "../register-training-form/register-training-form";

import type { FC, MouseEventHandler } from "react";

// TODO: 日付の初期値を設定したい
export const RegisterTrainingButtonAndModal: FC = () => {
  return (
    <RegisterTrainingButtonAndModalView
      RegisterTrainingForm={<RegisterTrainingForm />}
    />
  );
};

type ViewProps = {
  RegisterTrainingForm: JSX.Element;
};
export const RegisterTrainingButtonAndModalView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>トレーニングを記録する</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.RegisterTrainingForm}</ModalBody>
        </ModalContent>
      </Modal>
      <Button
        onClick={onClickButton}
        position="fixed"
        bottom={24}
        right={4}
        zIndex="docked"
        height={12}
        width={12}
        borderRadius="50%"
        color="white"
        backgroundColor="teal"
      >
        <AddIcon />
      </Button>
    </>
  );
};
