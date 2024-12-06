'use client'

import { useRef } from 'react'
import { Game } from '@/types/game'
import { GameCard } from './GameCard'

interface GameCarouselProps {
  games: Game[]
  isLoading?: boolean
}

export function GameCarousel({ games, isLoading = false }: GameCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return

    const scrollAmount = direction === 'left' ? -400 : 400
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  if (isLoading) {
    return <div className="h-[300px] w-full animate-pulse bg-gray-800 rounded-lg" />
  }

  if (!games?.length) {
    return <div className="h-[300px] w-full flex items-center justify-center text-gray-400">No games available</div>
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {games.map((game) => (
          <div key={game.id} className="flex-none w-[300px] snap-start">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
