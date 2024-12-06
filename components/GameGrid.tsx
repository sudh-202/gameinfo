import { useGameStore } from '@/lib/store'
import { GameCard } from './ui/GameCard'

interface GameGridProps {
  limit?: number
  featured?: boolean
}

export function GameGrid({ limit, featured = false }: GameGridProps) {
  const filteredGames = useGameStore((state) => state.filteredGames)
  const isLoading = useGameStore((state) => state.isLoading)
  const error = useGameStore((state) => state.error)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`aspect-video animate-pulse rounded-lg bg-[#1a2432] ${
              i === 0 && featured ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  const displayGames = limit ? filteredGames.slice(0, limit) : filteredGames

  if (displayGames.length === 0) {
    return (
      <div className="rounded-lg bg-blue-500/10 p-4 text-blue-500">
        <p>No games found. Try a different search term or category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {featured && (
        <div className="relative h-48 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/images/banner-bg.jpg)',
              filter: 'brightness(0.7)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1724] to-transparent" />
          <div className="relative flex h-full items-center px-8">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              CALENDAR AND RELEASE DATES FOR NEW AAA GAMES
            </h1>
          </div>
        </div>
      )}

      <div className="grid auto-rows-[1fr] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayGames.map((game, index) => (
          game && (
            <GameCard
              key={game.id}
              game={game}
              size={index === 0 && featured ? 'large' : 'normal'}
              featured={index === 0 && featured}
            />
          )
        ))}
      </div>
    </div>
  )
}
