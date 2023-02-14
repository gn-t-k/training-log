import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { RegisterTrainingButtonView } from "./register-training-button";

type Meta = ComponentMeta<typeof RegisterTrainingButtonView>;
type Props = ComponentProps<typeof RegisterTrainingButtonView>;
type Story = ComponentStoryObj<typeof RegisterTrainingButtonView>;

const componentMeta: Meta = {
  component: RegisterTrainingButtonView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <RegisterTrainingButtonView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};