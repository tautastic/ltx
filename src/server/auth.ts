import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import SpotifyProvider, { type SpotifyProfile } from "next-auth/providers/spotify";
import TwitchProvider, { type TwitchProfile } from "next-auth/providers/twitch";
import { customAlphabet } from "nanoid";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { type Adapter } from "next-auth/adapters";

const formatUserName = (p: string, u: string) => {
  const h1 = u.replaceAll(/[^a-zA-Z0-9_-]+/g, "") + "@" + p;
  const h2 = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5)();
  return h1 + h2;
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      id: string;
      image?: string | null;
      isVerified: boolean;
      name: string;
      username: string;
    };
  }

  interface User {
    email: string;
    id: string;
    image?: string | null;
    isVerified: boolean;
    name: string;
    username: string;
  }

  type AvailableProviders = "discord" | "github" | "google" | "spotify" | "twitch";
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.DISCORD_ID,
      clientSecret: env.DISCORD_SECRET,
      profile(profile: DiscordProfile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          email: profile.email,
          id: profile.id,
          isVerified: profile.verified,
          image: profile.image_url,
          name: profile.username,
          username: formatUserName("1", profile.username),
        };
      },
    }),
    GithubProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile(profile: GithubProfile) {
        return {
          email: profile.email || "",
          id: profile.id.toString(),
          isVerified: profile.two_factor_authentication,
          image: profile.avatar_url,
          name: profile.name || profile.login,
          username: formatUserName("2", profile.login),
        };
      },
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      profile(profile: GoogleProfile) {
        return {
          email: profile.email,
          id: profile.sub,
          isVerified: profile.email_verified,
          image: profile.picture.split("=")[0],
          name: profile.name,
          username: formatUserName("3", profile.name),
        };
      },
    }),
    SpotifyProvider({
      allowDangerousEmailAccountLinking: false,
      clientId: env.SPOTIFY_ID,
      clientSecret: env.SPOTIFY_SECRET,
      profile(profile: SpotifyProfile) {
        return {
          email: profile.email,
          id: profile.id,
          isVerified: false,
          image: profile.images[0]?.url,
          name: profile.display_name,
          username: formatUserName("4", profile.id),
        };
      },
    }),
    TwitchProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: env.TWITCH_ID,
      clientSecret: env.TWITCH_SECRET,
      profile(profile: TwitchProfile) {
        return {
          email: profile.email,
          id: profile.sub,
          isVerified: true,
          image: profile.picture,
          name: profile.preferred_username,
          username: formatUserName("4", profile.preferred_username),
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn({ account, user }) {
      if (!user?.email || user?.email.length < 1) {
        return false;
      }

      if (account?.provider === "Spotify") {
        return true;
      }

      return user.isVerified;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.email = user.email;
        session.user.id = user.id;
        session.user.isVerified = user.isVerified;
        session.user.image = user.image;
        session.user.name = user.name;
        session.user.username = user.username;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
