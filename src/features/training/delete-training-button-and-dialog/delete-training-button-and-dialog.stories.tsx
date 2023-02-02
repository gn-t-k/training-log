import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { DeleteTrainingButtonAndDialogView } from "./delete-training-button-and-dialog";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof DeleteTrainingButtonAndDialogView>;
type Props = ComponentProps<typeof DeleteTrainingButtonAndDialogView>;
type Story = ComponentStoryObj<typeof DeleteTrainingButtonAndDialogView>;

const componentMeta: Meta = {
  component: DeleteTrainingButtonAndDialogView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [deleteTrainingStatus, setDeleteTrainingStatus] =
    useState<MutationState>("idle");
  const deleteTraining: Props["deleteTraining"] = () => {
    (async (): Promise<void> => {
      setDeleteTrainingStatus("loading");
      await sleep(1000);
      action("update exercise")();
      setDeleteTrainingStatus("success");
    })();
  };
  const args: Props = {
    deleteTraining: props.deleteTraining ?? deleteTraining,
    deleteTrainingStatus: props.deleteTrainingStatus ?? deleteTrainingStatus,
  };

  return <DeleteTrainingButtonAndDialogView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
