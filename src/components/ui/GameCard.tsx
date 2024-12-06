import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

interface GameCardProps {
  title: string
  description: string
  price: number
  platform: string[]
  imageUrl: string
  crackStatus: string
  releaseDate: string
}

export function GameCard({
  title,
  description,
  price,
  platform,
  imageUrl,
  crackStatus,
  releaseDate,
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {platform.map((p) => (
            <span
              key={p}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">${price}</span>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              crackStatus === 'Cracked'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {crackStatus}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Release Date: {releaseDate}
        </div>
      </div>
    </motion.div>
  )
}
