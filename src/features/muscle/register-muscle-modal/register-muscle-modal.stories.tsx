import { Button, useDisclosure } from "@chakra-ui/react";
import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { RegisterMuscleModalView } from "./register-muscle-modal";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC} from "react";

type Meta = ComponentMeta<typeof RegisterMuscleModalView>;
type Props = ComponentProps<typeof RegisterMuscleModalView>;
type Story = ComponentStoryObj<typeof RegisterMuscleModalView>;

const componentMeta: Meta = {
  component: RegisterMuscleModalView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState<MutationState>("idle");
  const dummyRegisterMuscle: Props["registerMuscle"] = () => {
    (async (): Promise<void> => {
      setStatus("loading");
      await sleep(1000);
      setStatus("success");
      action("register muscle")();
      onClose();
    })();
  };
  const args: Props = {
    isOpen,
    onClose,
    muscles: props.muscles ?? [
      { id: "id1", name: "大胸筋" },
      { id: "id2", name: "上腕二頭筋" },
    ],
    registerMuscle: props.registerMuscle ?? dummyRegisterMuscle,
    registerMuscleStatus: props.registerMuscleStatus ?? status,
  };

  return (
    <>
      <Button onClick={onOpen}>モーダルを開く</Button>
      <RegisterMuscleModalView {...args} />
    </>
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
