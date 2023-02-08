import { endOfMonth, getMonth, getYear, startOfMonth } from "date-fns";

import type { Month } from "@/utils/date";

import { TrainingMonthlyCalendarView } from "./monthly-training-calendar";

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
  const today = new Date();
  const trainingDates = [startOfMonth(today), endOfMonth(today)];
  const args: Props = {
    today: props.today ?? today,
    year: props.year ?? getYear(today),
    month: props.month ?? (getMonth(today) as Month),
    trainingDates: props.trainingDates ?? trainingDates,
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
