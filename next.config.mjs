/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.0.102', '192.168.0.102:3000'],
};

export default nextConfig;
