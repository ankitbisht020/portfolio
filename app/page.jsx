'use client';
 

import React from 'react';
import { FaNodeJs } from "react-icons/fa";
import HomePage from "./HomePage";

async function getData() {
  const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL + '/.json';
  const res = await fetch(DB_URL, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export default function Page() {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {!isLoading && data ? (
        <HomePage data={data} />
      ) : (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-5 text-violet-600 fixed z-30 bg-gray-100 dark:bg-grey-900">
          <FaNodeJs size={100} className="animate-pulse" />
          <p className="animate-pulse text-xl">Loading...</p>
        </div>
      )}
    </>
  );
}
