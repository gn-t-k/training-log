import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { RegisterTrainingFormView } from "../register-training-form/register-training-form";
import { RegisterTrainingButtonAndModalView } from "./register-training-button-and-modal";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterTrainingButtonAndModalView>;
type Props = ComponentProps<typeof RegisterTrainingButtonAndModalView>;
type Story = ComponentStoryObj<typeof RegisterTrainingButtonAndModalView>;

const componentMeta: Meta = {
  component: RegisterTrainingButtonAndModalView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [registerTrainingStatus, setRegisterTrainingStatus] =
    useState<MutationState>("idle");
  const registerTraining: ComponentProps<
    typeof RegisterTrainingFormView
  >["registerTraining"] = (props) => {
    (async (): Promise<void> => {
      setRegisterTrainingStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setRegisterTrainingStatus("success");
    })();
  };
  const args: Props = {
    RegisterTrainingForm: props.RegisterTrainingForm ?? (
      <RegisterTrainingFormView
        registerTraining={registerTraining}
        registerTrainingStatus={registerTrainingStatus}
        exercises={[
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
        ]}
      />
    ),
  };

  return <RegisterTrainingButtonAndModalView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
