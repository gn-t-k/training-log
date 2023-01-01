import { NextPage } from "next";
import Link from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

const IndexPage: NextPage = () => {
  return (
    <div>
      <Link href={pagesPath.login.$url()}>ログインページ</Link>
      <Link href={pagesPath.logged_in.$url()}>ログイン済ページ</Link>
    </div>
  );
};

export default IndexPage;
