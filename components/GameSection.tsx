'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import GameCarousel from '@/components/ui/GameCarousel'

interface GameSectionProps {
  title: string
  section: 'upcoming' | 'latest' | 'all'
  statusLabel: string
  statusColor: string
}

export default function GameSection({ title, section, statusLabel, statusColor }: GameSectionProps) {
  const { games, loading, error, fetchGames } = useGameStore()

  useEffect(() => {
    console.log(`Fetching games for section: ${section}`)
    fetchGames(section)
  }, [section, fetchGames])

  useEffect(() => {
    console.log(`Games for ${section}:`, games[section])
  }, [games, section])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <span className={`${statusColor} text-black px-3 py-1 rounded-full text-sm font-medium`}>
          {statusLabel}
        </span>
      </div>

      {loading[section] ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="h-[300px] flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : games[section].length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No games found in this section.
        </div>
      ) : (
        <GameCarousel games={games[section]} />
      )}
    </section>
  )
}
