import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps, FC } from "react";

import { RegisterExerciseFormView } from "./register-exercise-form";

type Meta = ComponentMeta<typeof RegisterExerciseFormView>;
type Props = ComponentProps<typeof RegisterExerciseFormView>;
type Story = ComponentStoryObj<typeof RegisterExerciseFormView>;

const componentMeta: Meta = {
  component: RegisterExerciseFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const registerExercise: Props["registerExercise"] = (props) => {
    action("register exercise")(props);
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
    registerExercise: props.registerExercise ?? registerExercise,
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
