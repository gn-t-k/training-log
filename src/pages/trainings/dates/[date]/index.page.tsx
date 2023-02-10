import { format } from "date-fns";

import { pagesPath } from "@/libs/pathpida/$path";

import { Redirect } from "@/features/navigation/redirect/redirect";
import { useGetTrainingDate } from "@/features/training/use-get-training-date";
import { WeeklyTrainingPicker } from "@/features/training/weekly-training-picker/weekly-training-picker";

import type { GetServerSideProps, NextPage } from "next";
import type { FC } from "react";

type PageProps = {
  todayDateString: string;
};
const TrainingsOnDatePage: NextPage<PageProps> = (props) => {
  const trainingDate = useGetTrainingDate();

  if (trainingDate === null) {
    return (
      <Redirect
        redirectTo={pagesPath.trainings.dates
          ._date(props.todayDateString)
          .$url()}
      />
    );
  }

  return <TrainingsOnDate date={trainingDate} />;
};
export default TrainingsOnDatePage;

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const today = new Date();
  const props: PageProps = {
    todayDateString: format(today, "yyyy-MM-dd"),
  };

  return {
    props,
  };
};

type Props = {
  date: Date;
};
const TrainingsOnDate: FC<Props> = (props) => {
  return <WeeklyTrainingPicker selected={props.date} />;
};
