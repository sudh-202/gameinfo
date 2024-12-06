import { NextResponse } from 'next/server';

async function getIGDBAccessToken() {
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET() {
  try {
    const accessToken = await getIGDBAccessToken();
    
    const currentDate = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    const oneYearFromNow = currentDate + (365 * 24 * 60 * 60); // One year from now

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `fields name,cover.url,first_release_date,rating,genres.name,platforms.name;
            where first_release_date > ${currentDate} & first_release_date < ${oneYearFromNow};
            sort first_release_date asc;
            limit 50;`,
    });

    const games = await response.json();

    // Transform IGDB data to match our Game interface
    const transformedGames = games.map((game: any) => ({
      id: game.id.toString(),
      title: game.name,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null,
      imageUrl: game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : null,
      crackStatus: 'Upcoming',
      category: game.genres ? game.genres.map((genre: any) => genre.name) : [],
      metacritic: game.rating ? Math.round(game.rating) : null,
      platform: game.platforms ? game.platforms.map((platform: any) => platform.name) : [],
    }));

    return NextResponse.json(transformedGames);
  } catch (error) {
    console.error('Error fetching upcoming games from IGDB:', error);
    return NextResponse.json({ error: 'Failed to fetch upcoming games' }, { status: 500 });
  }
}
