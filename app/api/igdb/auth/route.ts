import { NextResponse } from 'next/server'

let cachedToken: string | null = null
let tokenExpiry: number | null = null

export async function GET() {
  try {
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return NextResponse.json({ access_token: cachedToken })
    }

    const params = new URLSearchParams({
      client_id: process.env.IGDB_CLIENT_ID!,
      client_secret: process.env.IGDB_CLIENT_SECRET!,
      grant_type: 'client_credentials'
    })

    console.log('Requesting new token...') // Debug log

    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Twitch OAuth Error:', {
        status: response.status,
        statusText: response.statusText,
        error,
        clientId: process.env.IGDB_CLIENT_ID,
      })
      throw new Error('Failed to authenticate with Twitch')
    }

    const data = await response.json()
    
    if (!data.access_token) {
      console.error('Invalid token response:', data)
      throw new Error('Invalid token response from Twitch')
    }

    // Cache the token
    cachedToken = data.access_token
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 300000 // Expire 5 minutes early

    console.log('Got new token:', {
      expiresIn: data.expires_in,
      tokenExpiry
    })

    return NextResponse.json({ access_token: data.access_token })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
