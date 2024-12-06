import { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function SearchBar() {
  const searchTerm = useGameStore((state) => state.searchTerm)
  const setSearchTerm = useGameStore((state) => state.setSearchTerm)
  const fetchGamesData = useGameStore((state) => state.fetchGamesData)

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchGamesData()
  }, [fetchGamesData])

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchGamesData(searchTerm)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, fetchGamesData])

  return (
    <div className="relative w-64">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded bg-[#1a2432] py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}
