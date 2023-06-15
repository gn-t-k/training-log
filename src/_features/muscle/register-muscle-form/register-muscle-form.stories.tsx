import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { RegisterMuscleFormView } from "./register-muscle-form";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterMuscleFormView>;
type Props = ComponentProps<typeof RegisterMuscleFormView>;
type Story = ComponentStoryObj<typeof RegisterMuscleFormView>;

const componentMeta: Meta = {
  component: RegisterMuscleFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [registerMuscleStatus, setRegisterMuscleStatus] =
    useState<MutationState>("idle");
  const registerMuscle: Props["registerMuscle"] = (props) => {
    void (async (): Promise<void> => {
      setRegisterMuscleStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setRegisterMuscleStatus("success");
    })();
  };

  const args: Props = {
    registerMuscle: props.registerMuscle ?? registerMuscle,
    registerMuscleStatus: props.registerMuscleStatus ?? registerMuscleStatus,
    registeredMuscles: props.registeredMuscles ?? [
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
      {
        id: "id-m-4",
        name: "上腕二頭筋",
      },
    ],
  };

  return <RegisterMuscleFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
