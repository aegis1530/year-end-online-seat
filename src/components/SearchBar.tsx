import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="relative flex-1">
        <div 
          className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          <Search className="h-6 w-6 text-purple-600" />
        </div>
        <input
          type="text"
          placeholder="請輸入短ID或桌號..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-14 pr-5 py-4 rounded-2xl focus:outline-none transition-all bg-white border-0"
          style={{ 
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(255,255,255,0.8)',
            transform: 'translateZ(0)'
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = 'inset 0 6px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(255,255,255,0.9)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'inset 0 4px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(255,255,255,0.8)';
          }}
        />
      </div>
      <button
        type="submit"
        className="px-8 py-4 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 hover:translate-y-[-4px]"
        style={{ 
          boxShadow: '0 8px 24px rgba(219, 39, 119, 0.4), inset 0 -3px 6px rgba(0,0,0,0.2)',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        🔍 確定
      </button>
    </form>
  );
}