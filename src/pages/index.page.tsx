import { getMonth, getYear } from "date-fns";
import Head from "next/head";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { NextPageWithLayout } from "./_app.page";
import type { FC, ReactElement } from "react";

const IndexPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Head>
        <title>training-log</title>
      </Head>
      <Index />
    </RequireLogin>
  );
};
IndexPage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
};
export default IndexPage;

const Index: FC = () => {
  const today = new Date();
  trpc.training.getMonthlyTrainings.useQuery({
    year: getYear(today),
    month: getMonth(today),
  });
  trpc.exercise.getAll.useQuery();
  trpc.muscle.getAll.useQuery();

  return <Redirect redirectTo={pagesPath.trainings.$url()} />;
};
