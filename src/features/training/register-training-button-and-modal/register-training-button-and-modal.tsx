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

import type { FC, MouseEventHandler, ComponentProps } from "react";

// TODO: 日付の初期値を設定したい
export const RegisterTrainingButtonAndModal: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const exitTrainingForm = useCallback<
    ComponentProps<typeof RegisterTrainingForm>["exitTrainingForm"]
  >(() => {
    onClose();
  }, [onClose]);

  return (
    <RegisterTrainingButtonAndModalView
      RegisterTrainingForm={
        <RegisterTrainingForm exitTrainingForm={exitTrainingForm} />
      }
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    />
  );
};

type ViewProps = {
  RegisterTrainingForm: JSX.Element;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};
export const RegisterTrainingButtonAndModalView: FC<ViewProps> = (props) => {
  const onClickButton = useCallback<MouseEventHandler>(
    (_) => {
      props.onOpen();
    },
    [props]
  );

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        closeOnOverlayClick={false}
      >
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
