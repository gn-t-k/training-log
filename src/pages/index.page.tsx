import { signIn, signOut, useSession } from "next-auth/react";

const IndexPage = () => {
  const { status, data } = useSession();

  if (status === "loading") return null;

  return (
    <>
      {!data && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {data && (
        <>
          Signed in as {data.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
};

export default IndexPage;
