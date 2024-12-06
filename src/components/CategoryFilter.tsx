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
  const { selectedCategory, setSelectedCategory } = useGameStore()

  return (
    <div className="mx-auto max-w-4xl overflow-x-auto px-4 py-4">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
