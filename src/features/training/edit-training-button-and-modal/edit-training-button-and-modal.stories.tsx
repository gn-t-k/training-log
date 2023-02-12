import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { EditTrainingButtonAndModalView } from "./edit-training-button-and-modal";

type Meta = ComponentMeta<typeof EditTrainingButtonAndModalView>;
type Props = ComponentProps<typeof EditTrainingButtonAndModalView>;
type Story = ComponentStoryObj<typeof EditTrainingButtonAndModalView>;

const componentMeta: Meta = {
  component: EditTrainingButtonAndModalView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <EditTrainingButtonAndModalView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};