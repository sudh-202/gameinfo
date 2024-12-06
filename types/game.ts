export interface Game {
  id: string
  title: string
  releaseDate: string
  imageUrl: string
  crackStatus: 'Cracked' | 'Not Cracked' | 'Upcoming'
  category: string[]
  metacritic: number | null
  platform: string[]
}
