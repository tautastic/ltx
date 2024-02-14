import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import api from "~/utils/api";
import ssr from "~/utils/ssr";
import { UserProfile } from "~/schemas";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ username: string }>
) => {
  const profileName = context.params?.username as string;
  try {
    const userProfile = await ssr.users.getProfileByUsername.fetch(profileName);
    return {
      props: {
        trpcState: ssr.dehydrate(),
        userProfile,
      },
    };
  } catch (e) {
    return {
      props: { profileName },
      notFound: true,
    };
  }
};

const Profile: NextPageWithAuthAndLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ userProfile }) => {
  if (!userProfile) {
    return null;
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
