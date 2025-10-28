import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Suche in Posts...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      await onSearch(query.trim());
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 md:py-2.5 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-calm-turquoise-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm md:text-base font-soft"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 hover:bg-slate-100 rounded-full"
          >
            <X className="w-3 h-3 text-slate-400" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
