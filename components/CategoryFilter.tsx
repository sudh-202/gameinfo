import { useGameStore } from '@/lib/store'

const categories = [
  'All',
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Sports',
  'Racing',
  'Simulation',
]

export function CategoryFilter() {
  const selectedCategory = useGameStore((state) => state.selectedCategory)
  const setSelectedCategory = useGameStore((state) => state.setSelectedCategory)

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-[#1a2432] text-gray-300 hover:bg-blue-600/20'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
