/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    images: {
      domains: ["img.freepik.com","res.cloudinary.com", 'firebasestorage.googleapis.com', 'img.icons8.com', 'raw.githubusercontent.com', 'i.imgur.com',"media.geeksforgeeks.org" ]
    }
  }
  
  module.exports = nextConfig