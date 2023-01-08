import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Heading,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { ComponentProps, FC, MouseEventHandler, useState } from "react";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { EditMuscleModal } from "@/features/muscle/edit-muscle-modal/edit-muscle-modal";
import { Muscle } from "@/features/muscle/muscle";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";
import { RegisterMuscleModal } from "@/features/muscle/register-muscle-modal/register-muscle-modal";

const MusclesContainer: NextPage = () => {
  return (
    <RequireLogin>
      <Muscles />
    </RequireLogin>
  );
};
export default MusclesContainer;

const Muscles: FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const {
    isOpen: isRegisterModalOpen,
    onOpen: onRegisterModalOpen,
    onClose: onRegisterModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: _onEditModalClose,
  } = useDisclosure();
  const onEditModalClose = (): void => {
    _onEditModalClose();
    setSelectedMuscle(null);
  };

  const onClickAdd: MouseEventHandler = (e) => {
    e.preventDefault();

    onRegisterModalOpen();
  };
  const onClickEditHOF =
    (muscle: Muscle): MouseEventHandler =>
    async (e) => {
      e.preventDefault();

      setSelectedMuscle(muscle);
      onEditModalOpen();
    };
  const editMuscleModalArgs: ComponentProps<typeof EditMuscleModal> =
    isEditModalOpen && selectedMuscle !== null
      ? {
          onClose: onEditModalClose,
          isOpen: isEditModalOpen,
          muscle: selectedMuscle,
        }
      : {
          onClose: onEditModalClose,
          isOpen: false,
        };

  return (
    <Container>
      <Stack direction="column">
        <RegisterMuscleModal
          {...{ isOpen: isRegisterModalOpen, onClose: onRegisterModalClose }}
        />
        <EditMuscleModal {...editMuscleModalArgs} />
        <Stack direction="row">
          <Button>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
          <Heading>部位</Heading>
          <Spacer />
          <Button onClick={onClickAdd}>
            <AddIcon />
          </Button>
        </Stack>
        <MuscleList {...{ onClickEditHOF }} />
      </Stack>
    </Container>
  );
};
