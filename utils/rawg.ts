import axios from 'axios';
import { Game } from '@/types/game';
import { config } from './config';

const api = axios.create({
  baseURL: config.rawg.apiUrl,
  params: {
    key: config.rawg.apiKey,
  },
});

interface RAWGGame {
  id: number;
  name: string;
  background_image: string;
  released: string;
  description?: string;
  genres?: { id: number; name: string; }[];
  platforms?: { platform: { id: number; name: string; } }[];
  metacritic?: number;
}

const transformRAWGGame = (game: RAWGGame): Game => {
  console.log('Transforming game:', game);
  return {
    id: game.id.toString(),
    title: game.name,
    releaseDate: game.released || '',
    imageUrl: game.background_image || '',
    crackStatus: 'Not Cracked', // Default status
    category: game.genres?.map(g => g.name) || [],
    metacritic: game.metacritic || null,
    platform: game.platforms?.map(p => p.platform.name) || [],
  };
};

export const fetchUpcomingGames = async (): Promise<Game[]> => {
  console.log('Fetching upcoming games...');
  const currentDate = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthDate = nextMonth.toISOString().split('T')[0];

  try {
    const { data } = await api.get('/games', {
      params: {
        dates: `${currentDate},${nextMonthDate}`,
        ordering: 'released',
        page_size: 10,
      },
    });
    console.log('Upcoming games response:', data);
    return data.results.map((game: RAWGGame) => ({
      ...transformRAWGGame(game),
      crackStatus: 'Upcoming',
    }));
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Request config:', error.config);
    }
    return [];
  }
};

export const fetchCrackedGames = async (): Promise<Game[]> => {
  console.log('Fetching cracked games...');
  try {
    const { data } = await api.get('/games', {
      params: {
        tags: 'singleplayer',
        metacritic: '80,100',
        ordering: '-released',
        page_size: 10,
      },
    });
    console.log('Cracked games response:', data);
    return data.results.map((game: RAWGGame) => ({
      ...transformRAWGGame(game),
      crackStatus: 'Cracked',
    }));
  } catch (error) {
    console.error('Error fetching cracked games:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Request config:', error.config);
    }
    return [];
  }
};

export const fetchUncrackedGames = async (): Promise<Game[]> => {
  console.log('Fetching uncracked games...');
  try {
    const { data } = await api.get('/games', {
      params: {
        dates: '2023-01-01,2024-12-31',
        tags: 'multiplayer',
        ordering: '-added',
        page_size: 10,
      },
    });
    console.log('Uncracked games response:', data);
    return data.results.map((game: RAWGGame) => ({
      ...transformRAWGGame(game),
      crackStatus: 'Not Cracked',
    }));
  } catch (error) {
    console.error('Error fetching uncracked games:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Request config:', error.config);
    }
    return [];
  }
};

export const fetchGameDetails = async (gameId: string): Promise<Game | null> => {
  console.log('Fetching game details for ID:', gameId);
  try {
    const { data } = await api.get(`/games/${gameId}`);
    console.log('Game details response:', data);
    return transformRAWGGame(data);
  } catch (error) {
    console.error('Error fetching game details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Request config:', error.config);
    }
    return null;
  }
};
