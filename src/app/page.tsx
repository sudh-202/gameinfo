'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { SearchBar } from '@/components/SearchBar'
import { CategoryFilter } from '@/components/CategoryFilter'
import { GameGrid } from '@/components/GameGrid'

// Sample game data - in a real app, this would come from an API
const sampleGames = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    description: 'An open-world, action-adventure RPG set in Night City',
    price: 59.99,
    platform: ['PC', 'PS5', 'Xbox Series X'],
    releaseDate: '2020-12-10',
    imageUrl: '/images/cyberpunk.jpg',
    trailerUrl: 'https://youtube.com/watch?v=...',
    crackStatus: 'Cracked',
    category: ['Action', 'RPG', 'Adventure'],
  },
  {
    id: '2',
    title: 'Elden Ring',
    description: 'An action RPG developed by FromSoftware',
    price: 59.99,
    platform: ['PC', 'PS5', 'Xbox Series X'],
    releaseDate: '2022-02-25',
    imageUrl: '/images/elden-ring.jpg',
    crackStatus: 'Cracked',
    category: ['Action', 'RPG'],
  },
  // Add more sample games as needed
]

export default function Home() {
  const setGames = useGameStore((state) => state.setGames)

  useEffect(() => {
    // In a real app, this would be an API call
    setGames(sampleGames)
  }, [setGames])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Game Information Hub
        </h1>
        <SearchBar />
        <CategoryFilter />
        <GameGrid />
      </div>
    </main>
  )
}
