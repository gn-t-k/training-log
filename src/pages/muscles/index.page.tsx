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
import { useRouter } from "next/router";
import { ComponentProps, FC, MouseEventHandler, useState } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { EditMuscleModal } from "@/features/muscle/edit-muscle-modal/edit-muscle-modal";
import { Muscle } from "@/features/muscle/muscle";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";
import { RegisterMuscleModal } from "@/features/muscle/register-muscle-modal/register-muscle-modal";

const Muscles: NextPage = () => {
  const router = useRouter();
  const goToTopPage: Props["goToTopPage"] = () => {
    router.push(pagesPath.$url());
  };

  return (
    <RequireLogin>
      <MusclesView goToTopPage={goToTopPage} />
    </RequireLogin>
  );
};
export default Muscles;

type Props = {
  goToTopPage: () => void;
};
const MusclesView: FC<Props> = (props) => {
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
  const goToTopPage: MouseEventHandler = (e) => {
    e.preventDefault();

    props.goToTopPage();
  };

  return (
    <Container>
      <Stack direction="column">
        <RegisterMuscleModal
          {...{ isOpen: isRegisterModalOpen, onClose: onRegisterModalClose }}
        />
        <EditMuscleModal {...editMuscleModalArgs} />
        <Stack direction="row">
          <Button onClick={goToTopPage}>
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
