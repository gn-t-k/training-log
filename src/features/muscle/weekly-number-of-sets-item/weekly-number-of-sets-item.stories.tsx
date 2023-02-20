import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { WeeklyNumberOfSetsItemView } from "./weekly-number-of-sets-item";

type Meta = ComponentMeta<typeof WeeklyNumberOfSetsItemView>;
type Props = ComponentProps<typeof WeeklyNumberOfSetsItemView>;
type Story = ComponentStoryObj<typeof WeeklyNumberOfSetsItemView>;

const componentMeta: Meta = {
  component: WeeklyNumberOfSetsItemView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <WeeklyNumberOfSetsItemView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};