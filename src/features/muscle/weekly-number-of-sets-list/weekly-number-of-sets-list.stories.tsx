import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { WeeklyNumberOfSetsListView } from "./weekly-number-of-sets-list";

type Meta = ComponentMeta<typeof WeeklyNumberOfSetsListView>;
type Props = ComponentProps<typeof WeeklyNumberOfSetsListView>;
type Story = ComponentStoryObj<typeof WeeklyNumberOfSetsListView>;

const componentMeta: Meta = {
  component: WeeklyNumberOfSetsListView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <WeeklyNumberOfSetsListView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};