import { create } from 'zustand';
import { Game } from '@/types/game';
import { fetchUpcomingGames, fetchCrackedGames, fetchUncrackedGames } from '@/utils/rawg';

type GameCategory = 'upcoming' | 'cracked' | 'uncracked';

interface GameStore {
  upcomingGames: Game[];
  crackedGames: Game[];
  uncrackedGames: Game[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
  setSearchTerm: (term: string) => void;
  fetchAllGames: () => Promise<void>;
  clearError: () => void;
  filteredGames: (category: GameCategory) => Game[];
}

export const useGameStore = create<GameStore>((set, get) => ({
  upcomingGames: [],
  crackedGames: [],
  uncrackedGames: [],
  searchTerm: '',
  isLoading: false,
  error: null,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  clearError: () => set({ error: null }),

  filteredGames: (category: GameCategory) => {
    const { searchTerm } = get();
    const games = get()[`${category}Games`] as Game[];
    
    if (!searchTerm?.trim()) return games;
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return games.filter(game => {
      const titleMatch = game.title.toLowerCase().includes(normalizedSearch);
      const categoryMatch = game.category.some(cat => 
        cat.toLowerCase().includes(normalizedSearch)
      );
      const platformMatch = game.platform.some(plat => 
        plat.toLowerCase().includes(normalizedSearch)
      );
      
      return titleMatch || categoryMatch || platformMatch;
    });
  },

  fetchAllGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const [upcoming, cracked, uncracked] = await Promise.all([
        fetchUpcomingGames().catch(() => [] as Game[]),
        fetchCrackedGames().catch(() => [] as Game[]),
        fetchUncrackedGames().catch(() => [] as Game[]),
      ]);

      set({
        upcomingGames: upcoming,
        crackedGames: cracked,
        uncrackedGames: uncracked,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
        upcomingGames: [],
        crackedGames: [],
        uncrackedGames: [],
      });
    }
  },
}));
