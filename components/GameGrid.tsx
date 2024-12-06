import { useGameStore } from '@/lib/store'
import { GameCard } from '@/components/ui/GameCard'

export function GameGrid() {
  const filteredGames = useGameStore((state) => state.filteredGames)

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredGames.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          price={game.price}
          platform={game.platform}
          imageUrl={game.imageUrl}
          crackStatus={game.crackStatus}
          releaseDate={game.releaseDate}
        />
      ))}
    </div>
  )
}
