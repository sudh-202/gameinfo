if (!process.env.NEXT_PUBLIC_RAWG_API_URL) {
  throw new Error('NEXT_PUBLIC_RAWG_API_URL is not defined in environment variables');
}

if (!process.env.RAWG_API_KEY) {
  throw new Error('RAWG_API_KEY is not defined in environment variables');
}

export const config = {
  rawg: {
    apiUrl: process.env.NEXT_PUBLIC_RAWG_API_URL,
    apiKey: process.env.RAWG_API_KEY,
  },
} as const;
