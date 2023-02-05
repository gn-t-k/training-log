import { TrainingMonthlyCalendarView } from "./training-monthly-calendar";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof TrainingMonthlyCalendarView>;
type Props = ComponentProps<typeof TrainingMonthlyCalendarView>;
type Story = ComponentStoryObj<typeof TrainingMonthlyCalendarView>;

const componentMeta: Meta = {
  component: TrainingMonthlyCalendarView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    today: props.today ?? new Date(),
  };

  return <TrainingMonthlyCalendarView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
