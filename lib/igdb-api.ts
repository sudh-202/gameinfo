// Types for IGDB API responses
interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
    image_id: string;
  };
  first_release_date?: number;
  genres?: { name: string }[];
  platforms?: { name: string }[];
}

import { Game } from './store'

export async function fetchGames(query = '') {
  try {
    const response = await fetch('/api/igdb/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch games')
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format')
    }

    return data
  } catch (error) {
    console.error('Error in fetchGames:', error)
    throw error
  }
}
