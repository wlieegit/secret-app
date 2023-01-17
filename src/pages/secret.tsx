import { useSignOut } from "@/utils/useSignOut";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

const SecretPage = () => {
  const { handleSignout } = useSignOut();
  return (
    <div>
      <h1>SecretPage</h1>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
};
export default SecretPage;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
