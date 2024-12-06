'use client'

import { useGameStore } from '@/lib/store'
import GameCarousel from '@/components/ui/GameCarousel'
import { Game } from '@/lib/store'

interface GameSectionProps {
  title: string
  filterFn: (game: Game) => boolean
}

export default function GameSection({ title, filterFn }: GameSectionProps) {
  const { games, isLoading, error } = useGameStore()

  const filteredGames = games.filter(filterFn)

  return (
    <section className="mb-16">
      <h2 className="mb-8 text-2xl font-bold text-white">{title}</h2>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="rounded-lg bg-blue-500/10 p-4 text-blue-500">
          <p>No games found in this section.</p>
        </div>
      ) : (
        <GameCarousel games={filteredGames} />
      )}
    </section>
  )
}
