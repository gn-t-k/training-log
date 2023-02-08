import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps, FC } from "react";

import { sleep } from "@/utils/sleep";

import { WeeklyTrainingCalendarView } from "./weekly-training-calendar";

type Meta = ComponentMeta<typeof WeeklyTrainingCalendarView>;
type Props = ComponentProps<typeof WeeklyTrainingCalendarView>;
type Story = ComponentStoryObj<typeof WeeklyTrainingCalendarView>;

const componentMeta: Meta = {
  component: WeeklyTrainingCalendarView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
  }

  return <WeeklyTrainingCalendarView {...args} />
}

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};