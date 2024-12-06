import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useGameStore } from '../lib/store'
import { useEffect } from 'react'

export function SearchBar() {
  const { games, searchTerm, selectedCategory, setFilteredGames, setSearchTerm } = useGameStore()

  useEffect(() => {
    const filtered = games.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || game.category.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
    setFilteredGames(filtered)
  }, [games, searchTerm, selectedCategory, setFilteredGames])

  return (
    <div className="relative mx-auto max-w-xl px-4">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
        />
      </div>
    </div>
  )
}
