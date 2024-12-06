'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';
import { GameCard } from '@/components/ui/GameCard';
import LoadingSpinner from './LoadingSpinner';

interface CarouselSectionProps {
  title: string;
  games: Game[];
  isLoading?: boolean;
}

const CarouselSection = ({ title, games, isLoading = false }: CarouselSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!games || games.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <div className="rounded-lg bg-blue-500/10 p-4 text-blue-300">
          No games available in this section.
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="space-x-2">
          <button
            onClick={() => scroll('left')}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {games.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`} className="flex-none">
            <GameCard game={game} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CarouselSection;
