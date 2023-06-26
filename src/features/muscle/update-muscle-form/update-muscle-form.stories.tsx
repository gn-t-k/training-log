import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { UpdateMuscleFormView } from "./update-muscle-form";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof UpdateMuscleFormView>;
type Props = ComponentProps<typeof UpdateMuscleFormView>;
type Story = ComponentStoryObj<typeof UpdateMuscleFormView>;

const componentMeta: Meta = {
  component: UpdateMuscleFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [updateMuscleState, setUpdateMuscleState] =
    useState<MutationState>("idle");
  const updateMuscle: Props["updateMuscle"] = (props) => {
    (async (): Promise<void> => {
      setUpdateMuscleState("loading");
      await sleep(1000);
      action("update muscle")(props);
      setUpdateMuscleState("success");
    })();
  };
  const args: Props = {
    muscle: props.muscle ?? {
      id: "id-m-1",
      name: "大胸筋",
    },
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
    updateMuscle: props.updateMuscle ?? updateMuscle,
    updateMuscleStatus: props.updateMuscleStatus ?? updateMuscleState,
  };

  return <UpdateMuscleFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
