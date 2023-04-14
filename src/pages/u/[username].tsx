import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import { api } from "~/utils/api";
import ssr from "~/utils/ssr";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ username: string }>
) => {
  const profileName = context.params?.username as string;
  const profileExists = await ssr.users.getExistsByUsername.fetch(profileName);
  if (profileExists) {
    await ssr.users.getProfileByUsername.prefetch(profileName);
  } else {
    return {
      props: { profileName },
      notFound: true,
    };
  }
  return {
    props: {
      trpcState: ssr.dehydrate(),
      profileName,
    },
  };
};

const Profile: NextPageWithAuthAndLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { data: userProfile, status } = api.users.getProfileByUsername.useQuery(props.profileName);

  if (status !== "success") {
    // won't happen since the query has been prefetched
    return <h1 className="text-3xl font-bold">Loading...</h1>;
  }

  return <h1 className="text-3xl font-bold">{userProfile.name}</h1>;
};

Profile.auth = false;
Profile.getLayout = (page) => {
  return (
    <>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start gap-y-16 px-6 py-24 invert-0 md:gap-y-14 md:py-32">
        {page}
      </main>
      <Footer />
    </>
  );
};

export default Profile;
