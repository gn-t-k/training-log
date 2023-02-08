import { endOfMonth, startOfMonth } from "date-fns";

import { TrainingMonthlyCalendarView } from "../monthly-training-calendar/monthly-training-calendar";
import { useMonthlyCalendar } from "../monthly-training-calendar/use-monthly-calendar";
import { MonthlyTrainingPickerView } from "./monthly-training-picker";

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
  const trainingDates = [startOfMonth(today), endOfMonth(today)];
  const [{ year, month }, { next, prev }] = useMonthlyCalendar({
    today,
  });
  const args: Props = {
    today: props.today ?? today,
    TrainingMonthlyCalendar: props.TrainingMonthlyCalendar ?? (
      <TrainingMonthlyCalendarView
        year={year}
        month={month}
        today={today}
        trainingDates={trainingDates}
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
