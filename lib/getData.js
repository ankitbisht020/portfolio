import { cache } from 'react';

// How often (in seconds) the site re-reads Firebase. Edits in the Realtime
// Database show up on the live site within this window.
export const REVALIDATE_SECONDS = 60;

// Fetches the whole portfolio JSON from the Firebase Realtime Database REST API.
// Wrapped in React's cache() so the page, its metadata and the AI route share one request.
export const getData = cache(async () => {
  const baseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/.json`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[getData] Failed to load portfolio data:', error);
    return null;
  }
});
