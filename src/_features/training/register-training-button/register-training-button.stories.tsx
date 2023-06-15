import { RegisterTrainingButtonView } from "./register-training-button";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterTrainingButtonView>;
type Props = ComponentProps<typeof RegisterTrainingButtonView>;
type Story = ComponentStoryObj<typeof RegisterTrainingButtonView>;

const componentMeta: Meta = {
  component: RegisterTrainingButtonView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    ...props,
  };

  return <RegisterTrainingButtonView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
