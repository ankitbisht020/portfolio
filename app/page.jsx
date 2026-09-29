import React from 'react';
import { FaNodeJs } from 'react-icons/fa';
import HomePage from './HomePage';
import { getData } from '@/lib/getData';

// Must be a literal number (Next.js reads it at build time). Keep in sync with lib/getData.js.
export const revalidate = 60;

const isHostedUrl = (url) => typeof url === 'string' && /^https?:\/\//.test(url);

export async function generateMetadata() {
  const data = await getData();
  const name = data?.main?.name || 'Portfolio';
  const role = data?.about?.title || 'Developer';
  const title = `${name} | ${role}`;
  const description = data?.main?.shortDesc || `Portfolio of ${name}`;
  const image = [data?.main?.heroImage, data?.about?.aboutImage].find(isHostedUrl);
  const keywords = [name, role, ...(data?.skills || []).map((s) => s.name)].filter(Boolean);

  return {
    title,
    description,
    keywords,
    authors: [{ name }],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: `${name}'s Portfolio`,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function Page() {
  const data = await getData();
  const aiEnabled = Boolean(process.env.AI_API_KEY && process.env.AI_MODEL);

  if (!data) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-5 text-violet-600 fixed z-30 bg-gray-100 dark:bg-grey-900">
        <FaNodeJs size={100} className="animate-pulse" />
        <p className="animate-pulse text-xl">Loading...</p>
      </div>
    );
  }

  return <HomePage data={data} aiEnabled={aiEnabled} />;
}
