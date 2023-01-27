import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { EditMuscleModalView } from "./edit-muscle-modal";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC} from "react";

type Meta = ComponentMeta<typeof EditMuscleModalView>;
type Props = ComponentProps<typeof EditMuscleModalView>;
type Story = ComponentStoryObj<typeof EditMuscleModalView>;

const componentMeta: Meta = {
  component: EditMuscleModalView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [updateMuscleStatus, setUpdateMuscleStatus] =
    useState<MutationState>("idle");
  const [deleteMuscleStatus, setDeleteMuscleStatus] =
    useState<MutationState>("idle");
  const dummyUpdateMuscleName: Props["updateMuscleName"] = ({ id, name }) => {
    (async (): Promise<void> => {
      setUpdateMuscleStatus("loading");
      await sleep(1000);
      action("update muscle name")({ id, name });
      setUpdateMuscleStatus("success");
      onClose();
    })();
  };
  const dummyDeleteMuscle: Props["deleteMuscle"] = (id) => {
    (async (): Promise<void> => {
      setDeleteMuscleStatus("loading");
      await sleep(1000);
      action("update muscle name")(id);
      setDeleteMuscleStatus("success");
      onClose();
    })();
  };

  const rest = {
    onClose,
    updateMuscleStatus,
    deleteMuscleStatus,
    registeredMuscles: props.registeredMuscles ?? [],
    updateMuscleName: props.updateMuscleName ?? dummyUpdateMuscleName,
    deleteMuscle: props.deleteMuscle ?? dummyDeleteMuscle,
  };
  const args: Props = isOpen
    ? {
        isOpen: true,
        muscle: { id: "id1", name: "大胸筋" },
        ...rest,
      }
    : {
        isOpen: false,
        ...rest,
      };

  return (
    <Box>
      <Button onClick={onOpen}>モーダルを開く</Button>
      <EditMuscleModalView {...args} />
    </Box>
  );
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
