import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { RegisterFormView } from "./register-form";

type Meta = ComponentMeta<typeof RegisterFormView>;
type Props = ComponentProps<typeof RegisterFormView>;
type Story = ComponentStoryObj<typeof RegisterFormView>;

const componentMeta: Meta = {
  component: RegisterFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <RegisterFormView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};