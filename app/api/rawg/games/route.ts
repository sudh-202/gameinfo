import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const RAWG_BASE_URL = 'https://api.rawg.io/api'
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY

// interface RAWGGame {
//   id: number
//   name: string
//   background_image: string
//   released: string
//   description?: string
//   genres?: { id: number; name: string }[]
//   platforms?: { platform: { id: number; name: string } }[]
//   metacritic?: number
// }

// interface RAWGResponse {
//   results: RAWGGame[]
//   count: number
//   next: string | null
//   previous: string | null
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get('endpoint') || 'games'
    const gameId = searchParams.get('gameId')

    // Build the API URL
    let url = `${RAWG_BASE_URL}/${endpoint}`
    if (gameId) {
      url += `/${gameId}`
    }

    // Add API key and other parameters
    const params = new URLSearchParams()
    params.append('key', API_KEY!)
    
    // Add additional search parameters based on the endpoint
    switch (endpoint) {
      case 'games':
        const dates = searchParams.get('dates')
        const ordering = searchParams.get('ordering')
        const tags = searchParams.get('tags')
        const search = searchParams.get('search')

        if (dates) params.append('dates', dates)
        if (ordering) params.append('ordering', ordering)
        if (tags) params.append('tags', tags)
        if (search) {
          params.append('search', search)
          params.append('search_precise', 'true')
        }
        break
    }

    const response = await axios.get(url, { params })
    
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('RAWG API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game data' },
      { status: 500 }
    )
  }
}
