interface IGDBAuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface IGDBGame {
  id: number
  name: string
  summary: string
  cover?: {
    image_id: string
  }
  first_release_date?: number
  platforms?: Array<{
    id: number
    name: string
  }>
  genres?: Array<{
    id: number
    name: string
  }>
  price?: number // Note: IGDB doesn't provide price info, we'll need to get this from another source
  status?: string // For crack status (we'll need to maintain this separately)
}

let accessToken: string | null = null
let tokenExpiry: number | null = null

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: 'POST',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get IGDB access token')
  }

  const data: IGDBAuthResponse = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + data.expires_in * 1000 - 300000 // Subtract 5 minutes for safety

  return accessToken
}

export async function searchGames(query: string) {
  const token = await getAccessToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_IGDB_API_ENDPOINT}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      search: query,
      fields: 'name,summary,cover.image_id,first_release_date,platforms.name,genres.name',
      limit: 20,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch games from IGDB')
  }

  const games: IGDBGame[] = await response.json()
  return games.map(transformIGDBGame)
}

export async function getPopularGames() {
  const token = await getAccessToken()

  const response = await fetch(`${process.env.NEXT_PUBLIC_IGDB_API_ENDPOINT}/games`, {
    method: 'POST',
    headers: {
      'Client-ID': process.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: 'name,summary,cover.image_id,first_release_date,platforms.name,genres.name',
      sort: 'rating desc',
      where: 'rating != null & cover != null',
      limit: 50,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch popular games from IGDB')
  }

  const games: IGDBGame[] = await response.json()
  return games.map(transformIGDBGame)
}

function transformIGDBGame(game: IGDBGame) {
  return {
    id: game.id.toString(),
    title: game.name,
    description: game.summary,
    price: game.price || 59.99, // Default price since IGDB doesn't provide this
    platform: game.platforms?.map((p) => p.name) || [],
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().split('T')[0]
      : 'TBA',
    imageUrl: game.cover
      ? `${process.env.NEXT_PUBLIC_IGDB_IMAGE_URL}/t_cover_big/${game.cover.image_id}.jpg`
      : '/images/placeholder.jpg',
    crackStatus: 'Not Cracked' as const, // Default status
    category: game.genres?.map((g) => g.name) || ['Uncategorized'],
  }
}
