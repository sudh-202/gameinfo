'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { GameGrid } from '@/components/GameGrid'

export default function Home() {
  const { fetchGamesData, isLoading, error, games } = useGameStore()

  useEffect(() => {
    fetchGamesData()
  }, [fetchGamesData])

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1724] to-[#1a2432]">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1724]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold text-white">GameStatus</h1>
          <div className="w-full max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Featured Games */}
        <section className="mb-16">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <GameGrid featured limit={6} />
          )}
        </section>

        {/* Latest Games */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-white">Latest Games</h2>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <GameGrid limit={6} />
          )}
        </section>

        {/* All Games */}
        <section>
          <h2 className="mb-8 text-2xl font-bold text-white">All Games</h2>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : games.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-400">No games found. Try a different search.</p>
            </div>
          ) : (
            <GameGrid />
          )}
        </section>
      </div>
    </main>
  )
}
