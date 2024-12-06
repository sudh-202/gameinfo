import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useGameStore } from '@/lib/store';

export function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { setSearchTerm, fetchAllGames } = useGameStore();

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value.trim());
      if (!value.trim()) {
        // Reset search and fetch all games when search is cleared
        fetchAllGames();
      }
    },
    [setSearchTerm, fetchAllGames]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(inputValue);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, handleSearch]);

  const clearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  return (
    <div className="relative w-full">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search games..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full rounded-lg bg-[#1a2432] py-2.5 pl-10 pr-10 text-white placeholder-gray-400 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {inputValue && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          aria-label="Clear search"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
