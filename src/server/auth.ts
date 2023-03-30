import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider, { type DiscordProfile } from "next-auth/providers/discord";
import GithubProvider, { type GithubProfile } from "next-auth/providers/github";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import SpotifyProvider, { type SpotifyProfile } from "next-auth/providers/spotify";
import TwitchProvider, { type TwitchProfile } from "next-auth/providers/twitch";
import { customAlphabet } from "nanoid";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

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
      name: string;
      username: string;
    };
  }

  interface User {
    email: string;
    id: string;
    image?: string | null;
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
          id: profile.id,
          name: profile.username,
          username: formatUserName("1", profile.username),
          email: profile.email,
          image: profile.image_url,
        };
      },
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: formatUserName("2", profile.login),
          email: profile.email || "",
          image: profile.avatar_url,
        };
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: formatUserName("3", profile.name),
          email: profile.email,
          image: profile.picture.split("=")[0],
        };
      },
    }),
    SpotifyProvider({
      clientId: env.SPOTIFY_ID,
      clientSecret: env.SPOTIFY_SECRET,
      profile(profile: SpotifyProfile) {
        return {
          id: profile.id,
          name: profile.display_name,
          username: formatUserName("4", profile.id),
          email: profile.email,
          image: profile.images[0]?.url,
        };
      },
    }),
    TwitchProvider({
      clientId: env.TWITCH_ID,
      clientSecret: env.TWITCH_SECRET,
      profile(profile: TwitchProfile) {
        return {
          id: profile.sub,
          name: profile.preferred_username,
          username: formatUserName("4", profile.preferred_username),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn({ profile }) {
      // Don't allow sign in if the user doesn't have an email address
      return profile?.email !== "";
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
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
  adapter: PrismaAdapter(prisma),
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
