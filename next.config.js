/** @type {import('next').NextConfig} */
const imageHosts = [
  'img.freepik.com',
  'res.cloudinary.com',
  'firebasestorage.googleapis.com',
  'img.icons8.com',
  'raw.githubusercontent.com',
  'i.imgur.com',
  'media.geeksforgeeks.org',
];

const nextConfig = {
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: 'https', hostname })),
  },
};

module.exports = nextConfig;
