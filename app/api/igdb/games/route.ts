import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authResponse = await fetch('http://localhost:3000/api/igdb/auth')
    if (!authResponse.ok) {
      throw new Error('Failed to get auth token')
    }
    const { access_token } = await authResponse.json()

    if (!access_token) {
      throw new Error('Invalid auth token')
    }

    const body = await request.json()
    const { query = '' } = body

    // Build IGDB query - escape quotes in search term
    const searchTerm = query.replace(/"/g, '\\"')
    const searchQuery = query
      ? `search "${searchTerm}";`
      : 'where first_release_date != null;'

    const igdbQuery = `fields name,summary,cover.*,first_release_date,genres.name,platforms.name,rating;
${searchQuery}
limit 50;
sort first_release_date desc;`

    const igdbResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'text/plain',
      },
      body: igdbQuery,
    })

    if (!igdbResponse.ok) {
      const errorText = await igdbResponse.text()
      console.error('IGDB API Error:', {
        status: igdbResponse.status,
        statusText: igdbResponse.statusText,
        error: errorText,
        query: igdbQuery,
      })
      throw new Error(`IGDB API error: ${igdbResponse.status} ${igdbResponse.statusText}`)
    }

    const games = await igdbResponse.json()

    // Transform the data
    const transformedGames = games.map((game: any) => ({
      id: game.id.toString(),
      title: game.name,
      description: game.summary || 'No description available',
      price: 59.99,
      platform: game.platforms?.map((p: any) => p.name) || ['PC'],
      releaseDate: game.first_release_date 
        ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
        : 'TBA',
      imageUrl: game.cover?.url 
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
        : '/images/placeholder.jpg',
      crackStatus: Math.random() > 0.5 ? 'Cracked' : 'Not Cracked',
      category: game.genres?.map((g: any) => g.name) || ['Action'],
    }))

    return NextResponse.json(transformedGames)
  } catch (error) {
    console.error('Games API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
