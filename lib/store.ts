import { create } from 'zustand';
import { Game } from '@/types/game';
import { fetchUpcomingGames, fetchCrackedGames, fetchUncrackedGames } from '@/utils/rawg';

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
}

export const useGameStore = create<GameStore>((set) => ({
  upcomingGames: [],
  crackedGames: [],
  uncrackedGames: [],
  searchTerm: '',
  isLoading: false,
  error: null,

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  clearError: () => set({ error: null }),

  fetchAllGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const [upcoming, cracked, uncracked] = await Promise.all([
        fetchUpcomingGames(),
        fetchCrackedGames(),
        fetchUncrackedGames(),
      ]);

      set({
        upcomingGames: upcoming,
        crackedGames: cracked,
        uncrackedGames: uncracked,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch games. Please try again later.',
        isLoading: false 
      });
      console.error('Error fetching all games:', error);
    }
  },
}));
