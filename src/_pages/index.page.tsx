import { getMonth, getYear } from "date-fns";
import Head from "next/head";

import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";

import type { NextPageWithLayout } from "./_app.page";
import type { FC, ReactElement } from "react";

const IndexPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>training-log</title>
      </Head>
      <RequireLogin>
        <Index />
      </RequireLogin>
    </>
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

  // return <Redirect redirectTo={pagesPath.trainings.$url()} />;
  return <Redirect redirectTo={pagesPath.$url()} />;
};
