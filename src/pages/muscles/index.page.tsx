import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Heading,
  Spacer,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useEffect } from "react";
import { z } from "zod";

import { RequireLogin } from "@/features/auth/require-login/require-login";
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

const querySchema = z.object({
  id: z.string(),
});
type Query = z.infer<typeof querySchema>;

const Muscles: FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const query = ((): Query | null => {
    const maybeQuery = querySchema.safeParse(router.query);

    return maybeQuery.success ? maybeQuery.data : null;
  })();

  useEffect(() => {
    if (query !== null) {
      console.log({ id: query.id });
    }
  }, [isOpen, query]);

  const onClickAdd: MouseEventHandler = (e) => {
    e.preventDefault();

    onOpen();
  };
  const onClickEditHOF =
    (muscle: Muscle): MouseEventHandler =>
    (e) => {
      e.preventDefault();

      toast({
        title: muscle.name,
      });
    };

  return (
    <Container>
      <Stack direction="column">
        <RegisterMuscleModal {...{ isOpen, onClose }} />
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
