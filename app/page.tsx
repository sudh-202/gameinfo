'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { SearchBar } from '@/components/SearchBar';
import { CarouselSection } from '@/components/CarouselSection';
// import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const {
    fetchAllGames,
    // isLoading,
    error,
    // filteredGames,
    // searchTerm,
  } = useGameStore();

  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="rounded-lg bg-red-500/10 p-6 text-center text-red-500">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => fetchAllGames()}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <CarouselSection
          title="Upcoming Games"
          type="upcoming"
        />
        <CarouselSection
          title="Cracked Games"
          type="cracked"
        />
        <CarouselSection
          title="Uncracked Games"
          type="uncracked"
        />
      </main>
    </div>
  );
}
