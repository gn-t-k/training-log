import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { RegisterExerciseFormView } from "./register-exercise-form";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterExerciseFormView>;
type Props = ComponentProps<typeof RegisterExerciseFormView>;
type Story = ComponentStoryObj<typeof RegisterExerciseFormView>;

const componentMeta: Meta = {
  component: RegisterExerciseFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [registerExerciseStatus, setRegisterExerciseStatus] =
    useState<MutationState>("idle");
  const registerExercise: Props["registerExercise"] = (props) => {
    void (async (): Promise<void> => {
      setRegisterExerciseStatus("loading");
      await sleep(1000);
      action("register exercise")(props);
      setRegisterExerciseStatus("success");
    })();
  };
  const args: Props = {
    targets: props.targets ?? [
      {
        id: "id1",
        name: "大胸筋",
      },
      {
        id: "id2",
        name: "上腕三頭筋",
      },
    ],
    registeredExercises: props.registeredExercises ?? [],
    registerExercise: props.registerExercise ?? registerExercise,
    registerExerciseStatus:
      props.registerExerciseStatus ?? registerExerciseStatus,
  };

  return <RegisterExerciseFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
