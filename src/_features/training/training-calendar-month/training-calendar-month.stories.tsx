import { addDays, endOfMonth, getMonth, getYear, startOfMonth } from "date-fns";

import { TrainingCalendarMonthView } from "./training-calendar-month";

import type { Month } from "@/_utils/date";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof TrainingCalendarMonthView>;
type Props = ComponentProps<typeof TrainingCalendarMonthView>;
type Story = ComponentStoryObj<typeof TrainingCalendarMonthView>;

const componentMeta: Meta = {
  component: TrainingCalendarMonthView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const today = new Date();
  const selected = addDays(today, 2);
  const trainingDates = [startOfMonth(today), endOfMonth(today)];
  const args: Props = {
    today: props.today ?? today,
    year: props.year ?? getYear(today),
    month: props.month ?? (getMonth(today) as Month),
    trainingDates: props.trainingDates ?? trainingDates,
    selected: props.selected ?? selected,
  };

  return <TrainingCalendarMonthView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
