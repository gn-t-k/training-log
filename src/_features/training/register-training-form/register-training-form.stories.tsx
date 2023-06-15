import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { RegisterTrainingFormView } from "./register-training-form";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterTrainingFormView>;
type Props = ComponentProps<typeof RegisterTrainingFormView>;
type Story = ComponentStoryObj<typeof RegisterTrainingFormView>;

const componentMeta: Meta = {
  component: RegisterTrainingFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [registerTrainingStatus, setRegisterTrainingStatus] =
    useState<MutationState>("idle");
  const registerTraining: Props["registerTraining"] = (props) => {
    void (async (): Promise<void> => {
      setRegisterTrainingStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setRegisterTrainingStatus("success");
    })();
  };
  const args: Props = {
    registerTraining: props.registerTraining ?? registerTraining,
    registerTrainingStatus:
      props.registerTrainingStatus ?? registerTrainingStatus,
    exercises: props.exercises ?? [
      {
        id: "id-e-1",
        name: "ベンチプレス",
        targets: [
          {
            id: "id-m-1",
            name: "大胸筋",
          },
          {
            id: "id-m-2",
            name: "上腕三頭筋",
          },
          {
            id: "id-m-3",
            name: "三角筋前部",
          },
        ],
      },
      {
        id: "id-e-2",
        name: "アームカール",
        targets: [
          {
            id: "id-m-4",
            name: "上腕二頭筋",
          },
        ],
      },
    ],
  };

  return <RegisterTrainingFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
