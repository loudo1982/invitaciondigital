/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  async rewrites() {
    return [
      { source: "/invitación/:slug", destination: "/invitacion/:slug" },
    ];
  },
};
module.exports = nextConfig;
