import { create } from 'zustand'

interface Game {
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
}

interface GameStore {
  games: Game[]
  filteredGames: Game[]
  searchTerm: string
  selectedCategory: string
  setGames: (games: Game[]) => void
  setFilteredGames: (games: Game[]) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
}

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  filteredGames: [],
  searchTerm: '',
  selectedCategory: 'All',
  setGames: (games) => set({ games, filteredGames: games }),
  setFilteredGames: (games) => set({ filteredGames: games }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}))
