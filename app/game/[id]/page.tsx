'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchGameDetails } from '@/utils/rawg'
import { Game } from '@/lib/store'

export default function GamePage({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, ] = useState<string | null>(null)

  useEffect(() => {
    const loadGame = async () => {
      try {
        const gameData = await fetchGameDetails(params.id)
        setGame(gameData)
      }
      //  catch (err) {
      //   setError('Failed to load game details')
      // }
       finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">{error || 'Game not found'}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1724] to-[#1a2432] py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Link 
          href="/"
          className="mb-8 inline-block text-blue-400 hover:text-blue-300"
        >
          ← Back to Home
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={game.background_image || '/placeholder.jpg'}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold">{game.name}</h1>
            
            {game.released && (
              <p className="mb-4 text-gray-400">
                Release Date: {new Date(game.released).toLocaleDateString()}
              </p>
            )}

            {game.genres && game.genres.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-xl font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.platforms && game.platforms.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-xl font-semibold">Platforms</h2>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.description && (
              <div className="mt-6">
                <h2 className="mb-2 text-xl font-semibold">About</h2>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
