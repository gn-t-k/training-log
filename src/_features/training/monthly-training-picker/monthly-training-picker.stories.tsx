import { addDays, endOfMonth, startOfMonth } from "date-fns";

import { MonthlyTrainingPickerView } from "./monthly-training-picker";
import { useMonthlyCalendar } from "./use-monthly-calendar";
import { TrainingCalendarMonthView } from "../training-calendar-month/training-calendar-month";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof MonthlyTrainingPickerView>;
type Props = ComponentProps<typeof MonthlyTrainingPickerView>;
type Story = ComponentStoryObj<typeof MonthlyTrainingPickerView>;

const componentMeta: Meta = {
  component: MonthlyTrainingPickerView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const today = new Date();
  const selected = addDays(today, 2);
  const trainingDates = [startOfMonth(today), endOfMonth(today)];
  const [{ year, month }, { next, prev }] = useMonthlyCalendar({
    today,
    selected,
  });
  const args: Props = {
    today: props.today ?? today,
    TrainingCalendarMonth: props.TrainingCalendarMonth ?? (
      <TrainingCalendarMonthView
        year={year}
        month={month}
        today={today}
        trainingDates={trainingDates}
        selected={selected}
      />
    ),
    year: props.year ?? year,
    month: props.month ?? month,
    next: props.next ?? next,
    prev: props.prev ?? prev,
  };

  return <MonthlyTrainingPickerView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
