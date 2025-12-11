import React, { useState } from 'react';
import seatingChartImage from '../assets/seating-chart.png';

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
    <div>
      {/* 座位圖片 */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <img 
          src={seatingChartImage} 
          alt="座位分佈圖" 
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>

      {/* 搜尋表單 */}
      <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        marginBottom: '24px',
        borderRadius: '18px',
        border: '1px solid #cfa350',
        background: 'linear-gradient(135deg, #4a1f24 0%, #2a0f15 100%)',
        boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden'
      }}
    >
      <input
        type="text"
        placeholder="輸入桌號或 shortId"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: '75%',
          border: 'none',
          padding: '12px 16px',
          fontSize: '18px',
          background: 'transparent',
          color: '#fbeac3',
          outline: 'none'
        }}
        className="placeholder-opacity-50"
      />
      <style>{`
        input::placeholder {
          color: rgba(251, 234, 195, 0.5);
        }
      `}</style>
      <button
        type="submit"
        style={{
          flex: 1,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          borderLeft: '1px solid rgba(250, 225, 160, 0.4)',
          background: 'linear-gradient(135deg, #cfa350 0%, #f7d57b 35%, #b17d2e 100%)',
          color: '#3b200b',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
          letterSpacing: '0.18em'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(1px)';
          e.currentTarget.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.6)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.6)';
        }}
      >
        搜尋
      </button>
    </form>
    </div>
  );
}