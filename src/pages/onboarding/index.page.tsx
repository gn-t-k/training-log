import { NextPage } from "next";

import { RequireLogin } from "@/features/auth/require-login/require-login";

const Onboarding: NextPage = () => {
  return <RequireLogin></RequireLogin>;
};
export default Onboarding;
