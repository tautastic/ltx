// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/avatars/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/embed/avatars/*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/*",
        port: "",
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net",
        pathname: "/jtv_user_pictures/*",
        port: "",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/tautastic/ltx",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://github.com/tautastic/ltx/issues",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: true,
};

export default config;
