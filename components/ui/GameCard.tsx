import Image from 'next/image'
import { Game } from '@/lib/store'
import { format, isValid, parseISO } from 'date-fns'
import clsx from 'clsx'

interface GameCardProps {
  game: Game
  size?: 'normal' | 'large'
  featured?: boolean
}

export function GameCard({ game, size = 'normal', featured = false }: GameCardProps) {
  if (!game || typeof game !== 'object') {
    return null
  }

  const imageUrl = !game.imageUrl
    ? '/images/placeholder.jpg'
    : game.imageUrl.startsWith('/')
      ? game.imageUrl
      : !game.imageUrl.startsWith('http')
        ? `https://${game.imageUrl.replace(/^\/\//, '')}`
        : game.imageUrl

  const formattedDate = game.releaseDate
    ? (() => {
        try {
          const date = parseISO(game.releaseDate)
          return isValid(date) ? format(date, 'yyyy-MM-dd') : 'TBA'
        } catch {
          return 'TBA'
        }
      })()
    : 'TBA'

  return (
    <div 
      className={clsx(
        'group relative overflow-hidden rounded-lg bg-[#0f1724] transition-all hover:scale-105',
        {
          'col-span-1': size === 'normal',
          'col-span-2 row-span-2': size === 'large',
          'ring-2 ring-blue-500': featured
        }
      )}
    >
      {featured && (
        <div className="absolute right-2 top-2 z-10 rounded bg-blue-500 px-2 py-1 text-xs font-bold text-white">
          AAA GAME
        </div>
      )}
      
      {/* Image Container */}
      <div className={clsx(
        'relative',
        size === 'normal' ? 'aspect-[16/9]' : 'aspect-[16/10]'
      )}>
        <Image
          src={imageUrl}
          alt={game.title || 'Game cover'}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes={size === 'large' 
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
          priority={featured}
          unoptimized={!imageUrl.includes('rawg.io')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-transparent to-transparent" />
      </div>

      {/* Game Info */}
      <div className={clsx(
        'p-4',
        size === 'large' && 'p-6'
      )}>
        <h3 className={clsx(
          'font-bold text-white line-clamp-1',
          size === 'large' ? 'mb-3 text-2xl' : 'mb-2 text-xl'
        )}>
          {game.title}
        </h3>

        {/* Crack Status */}
        <div className="mb-3">
          <span
            className={clsx(
              'inline-block rounded px-3 py-1 font-medium',
              size === 'large' ? 'text-base' : 'text-sm',
              game.crackStatus === 'Cracked'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            )}
          >
            {game.crackStatus || 'Unknown'}
          </span>
          {game.crackStatus !== 'Cracked' && (
            <span className={clsx(
              'ml-2 text-gray-400',
              size === 'large' ? 'text-base' : 'text-sm'
            )}>
              {game.crackStatus === 'Not Cracked' ? '1 day(s)' : ''}
            </span>
          )}
        </div>

        {/* Platforms */}
        <div className="mb-3 flex flex-wrap gap-2">
          {(game.platform || []).slice(0, size === 'large' ? 5 : 3).map((platform) => (
            <span
              key={platform}
              className={clsx(
                'rounded bg-blue-600/20 px-2 py-1 font-medium text-blue-400',
                size === 'large' ? 'text-sm' : 'text-xs'
              )}
            >
              {platform}
            </span>
          ))}
        </div>

        {/* Release Date and Metacritic */}
        <div className="flex items-center justify-between">
          <span className={clsx(
            'text-gray-400',
            size === 'large' ? 'text-base' : 'text-sm'
          )}>
            {formattedDate}
          </span>
          {game.metacritic && (
            <span className={clsx(
              'rounded bg-yellow-500/20 px-2 py-1 font-medium text-yellow-400',
              size === 'large' ? 'text-sm' : 'text-xs'
            )}>
              {game.metacritic}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
