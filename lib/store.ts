import { create } from 'zustand'

export interface Game {
  id: string
  title: string
  description: string
  price: number
  platform: string[]
  releaseDate: string
  imageUrl: string
  trailerUrl?: string
  crackStatus: 'Cracked' | 'Not Cracked' | 'Denuvo' | 'Online Only'
  category: string[]
  rating?: number
  metacritic?: number
}

interface GameStore {
  games: Game[]
  filteredGames: Game[]
  searchTerm: string
  selectedCategory: string
  isLoading: boolean
  error: string | null
  currentPage: number
  totalGames: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  setGames: (games: Game[]) => void
  setFilteredGames: (games: Game[]) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  fetchGamesData: (query?: string, page?: number) => Promise<void>
  clearError: () => void
  filterGames: () => void
}

const categories = ['All', 'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation']

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  filteredGames: [],
  searchTerm: '',
  selectedCategory: 'All',
  isLoading: false,
  error: null,
  currentPage: 1,
  totalGames: 0,
  hasNextPage: false,
  hasPreviousPage: false,

  setGames: (games) => {
    set({ games })
    get().filterGames()
  },

  setFilteredGames: (games) => set({ filteredGames: games }),

  setSearchTerm: (searchTerm) => {
    set({ searchTerm, error: null })
    const debouncedSearch = setTimeout(() => {
      get().fetchGamesData(searchTerm, 1) // Reset to first page on new search
    }, 500) // Debounce search for 500ms

    return () => clearTimeout(debouncedSearch)
  },

  setSelectedCategory: (selectedCategory) => {
    set({ selectedCategory })
    get().filterGames()
  },

  clearError: () => set({ error: null }),

  filterGames: () => {
    const { games, selectedCategory } = get()
    
    let filtered = [...games]

    // Only apply category filter (search is handled by API)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(game => 
        game.category.includes(selectedCategory)
      )
    }

    set({ filteredGames: filtered })
  },

  fetchGamesData: async (query?: string, page: number = 1) => {
    set({ isLoading: true, error: null })
    try {
      const searchParams = new URLSearchParams()
      if (query) searchParams.append('search', query)
      searchParams.append('page', page.toString())
      searchParams.append('page_size', '20')

      const response = await fetch(`/api/rawg/games?${searchParams.toString()}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch games')
      }

      const data = await response.json()
      
      set({ 
        games: data.games,
        filteredGames: data.games,
        totalGames: data.count,
        currentPage: page,
        hasNextPage: !!data.next,
        hasPreviousPage: !!data.previous,
        isLoading: false 
      })
    } catch (error) {
      console.error('Error fetching games:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false
      })
    }
  },
}))
