import { addMonths, getMonth, getYear, subMonths } from "date-fns";
import { useCallback, useEffect, useState } from "react";

import type { Month, Year } from "@/utils/date";

type UseMonthlyCalendar = (props: {
  today: Date;
  selected: Date;
}) => [state: State, setState: SetState];
type State = {
  year: Year;
  month: Month;
};
type SetState = {
  next: () => void;
  prev: () => void;
};

export const useMonthlyCalendar: UseMonthlyCalendar = (props) => {
  const [date, setDate] = useState(props.today);
  const [year, setYear] = useState<Year>(getYear(props.today));
  const [month, setMonth] = useState<Month>(getMonth(props.today) as Month);

  useEffect(() => {
    setDate(props.selected);
    setYear(getYear(props.selected));
    setMonth(getMonth(props.selected) as Month);
  }, [props.selected]);

  const next = useCallback<SetState["next"]>(() => {
    const newDate = addMonths(date, 1);
    setDate(newDate);
    setYear(getYear(newDate));
    setMonth(getMonth(newDate) as Month);
  }, [date]);
  const prev = useCallback<SetState["prev"]>(() => {
    const newDate = subMonths(date, 1);
    setDate(newDate);
    setYear(getYear(newDate));
    setMonth(getMonth(newDate) as Month);
  }, [date]);

  return [
    { year, month },
    { next, prev },
  ];
};
