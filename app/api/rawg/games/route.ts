import { NextRequest, NextResponse } from 'next/server'

interface RAWGPlatform {
  platform: {
    name: string;
  };
}

interface RAWGGenre {
  name: string;
}

interface RAWGGame {
  id: number;
  name: string;
  description_raw?: string;
  platforms?: RAWGPlatform[];
  released?: string;
  background_image?: string;
  clip?: {
    clip?: string;
  };
  genres?: RAWGGenre[];
  rating?: number;
  metacritic?: number;
}

interface RAWGResponse {
  results: RAWGGame[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('search') || ''
    const page = searchParams.get('page') || '1'
    const pageSize = searchParams.get('page_size') || '20'

    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_RAWG_API_URL}/games`)
    apiUrl.searchParams.append('key', process.env.RAWG_API_KEY!)
    apiUrl.searchParams.append('page_size', pageSize)
    apiUrl.searchParams.append('page', page)
    
    if (query) {
      apiUrl.searchParams.append('search', query)
      apiUrl.searchParams.append('search_precise', 'true')
    }

    const response = await fetch(apiUrl.toString())

    if (!response.ok) {
      const error = await response.text()
      console.error('RAWG API Error:', {
        status: response.status,
        statusText: response.statusText,
        error
      })
      throw new Error(`RAWG API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json() as RAWGResponse

    // Transform the data to match our app's format
    const transformedGames = data.results.map((game: RAWGGame) => ({
      id: game.id.toString(),
      title: game.name,
      description: game.description_raw || 'No description available',
      price: 59.99, // Default price
      platform: game.platforms?.map((p) => p.platform.name) || ['PC'],
      releaseDate: game.released || 'TBA',
      imageUrl: game.background_image || '/images/placeholder.jpg',
      trailerUrl: game.clip?.clip || undefined,
      crackStatus: Math.random() > 0.5 ? 'Cracked' : 'Not Cracked', // Simulated crack status
      category: game.genres?.map((g) => g.name) || ['Action'],
      rating: game.rating || null,
      metacritic: game.metacritic || null,
    }))

    return NextResponse.json({
      games: transformedGames,
      count: data.count,
      next: data.next,
      previous: data.previous
    })
  } catch (error) {
    console.error('Games API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
