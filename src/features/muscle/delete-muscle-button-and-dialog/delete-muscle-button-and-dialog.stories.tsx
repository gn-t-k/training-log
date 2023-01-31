import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { DeleteMuscleButtonAndDialogView } from "./delete-muscle-button-and-dialog";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof DeleteMuscleButtonAndDialogView>;
type Props = ComponentProps<typeof DeleteMuscleButtonAndDialogView>;
type Story = ComponentStoryObj<typeof DeleteMuscleButtonAndDialogView>;

const componentMeta: Meta = {
  component: DeleteMuscleButtonAndDialogView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [deleteMuscleStatus, setDeleteMuscleStatus] =
    useState<MutationState>("idle");
  const deleteMuscle: Props["deleteMuscle"] = () => {
    (async (): Promise<void> => {
      setDeleteMuscleStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setDeleteMuscleStatus("success");
    })();
  };
  const args: Props = {
    muscle: props.muscle ?? {
      id: "id-m-1",
      name: "大胸筋",
    },
    deleteMuscle: props.deleteMuscle ?? deleteMuscle,
    deleteMuscleStatus: props.deleteMuscleStatus ?? deleteMuscleStatus,
  };

  return <DeleteMuscleButtonAndDialogView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
