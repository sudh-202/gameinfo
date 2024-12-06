'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { SearchBar } from '@/components/SearchBar';
import CarouselSection from '@/components/CarouselSection';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const {
    fetchAllGames,
    isLoading,
    error,
    upcomingGames,
    crackedGames,
    uncrackedGames,
    searchTerm,
  } = useGameStore();

  useEffect(() => {
    console.log('Fetching games...');
    fetchAllGames();
  }, [fetchAllGames]);

  // Debug logs
  useEffect(() => {
    console.log('Current state:', {
      isLoading,
      error,
      upcomingGamesCount: upcomingGames.length,
      crackedGamesCount: crackedGames.length,
      uncrackedGamesCount: uncrackedGames.length,
      searchTerm
    });
  }, [isLoading, error, upcomingGames, crackedGames, uncrackedGames, searchTerm]);

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

  const sections = [
    { title: 'Upcoming Games', games: upcomingGames },
    { title: 'Cracked Games', games: crackedGames },
    { title: 'Uncracked Games', games: uncrackedGames },
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    games: section.games.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1724] to-[#1a2432]">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1724]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold text-white">GameStatus</h1>
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : searchTerm && !filteredSections.some(section => section.games.length > 0) ? (
          <div className="rounded-lg bg-blue-500/10 p-4 text-blue-300 text-center">
            No games found matching "{searchTerm}"
          </div>
        ) : (
          filteredSections.map(section => (
            <CarouselSection
              key={section.title}
              title={section.title}
              games={section.games}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </main>
  );
}
