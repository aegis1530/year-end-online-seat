import React from 'react';
import { Seat, TableStats } from '../App';

interface SeatListProps {
  seats: Seat[];
  searchQuery: string;
  showStats?: boolean;
  tableStats?: TableStats[];
}

export function SeatList({ seats, searchQuery, showStats, tableStats }: SeatListProps) {
  // 顯示統計資料
  if (showStats && tableStats && tableStats.length > 0) {
    return (
      <div
        style={{
          borderRadius: '18px',
          border: '1px solid #cfa350',
          background: 'linear-gradient(135deg, #3a1416 0%, #2b0f12 45%, #1b070b 100%)',
          boxShadow: '0 0 16px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 215, 128, 0.15)',
          padding: '16px 18px'
        }}
      >
        {tableStats.map((stat, index) => (
          <div
            key={index}
            style={{
              padding: '12px 0',
              fontSize: '16px',
              color: '#f6e4ba',
              borderBottom: index < tableStats.length - 1 ? '1px solid rgba(230, 190, 120, 0.25)' : 'none',
              lineHeight: '1.8'
            }}
          >
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', color: '#f4e1a8' }}>
                {stat.meatCount}葷{stat.vegetarianCount}素
              </span>
              <span style={{ color: '#f1ddad', marginLeft: '8px' }}>
                (共{stat.tables.length}桌)
              </span>
            </div>
            <div style={{ color: '#cfa350', fontSize: '15px' }}>
              [ {stat.tables.join(' , ')} ]
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div 
        className="text-center"
        style={{
          padding: '32px 18px',
          color: '#f6e4ba',
          fontSize: '16px'
        }}
      >
        {searchQuery ? (
          <div>沒有找到符合的座位</div>
        ) : (
          <div>請輸入 shortId 或桌號開始搜尋<br></br>
            (輸入桌號 0 可查統計資料)
            </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: '18px',
        border: '1px solid #cfa350',
        background: 'linear-gradient(135deg, #3a1416 0%, #2b0f12 45%, #1b070b 100%)',
        boxShadow: '0 0 16px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 215, 128, 0.15)',
        padding: '4px 0'
      }}
    >
      {seats.map((seat, index) => (
        <div
          key={seat.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1.2fr 1.8fr',
            padding: '10px 18px',
            alignItems: 'center',
            fontSize: '16px',
            color: '#f6e4ba',
            borderBottom: index < seats.length - 1 ? '1px solid rgba(230, 190, 120, 0.25)' : 'none'
          }}
        >
          <div 
            style={{
              textAlign: 'left',
              fontWeight: 'bold'
            }}
          >
            {seat.tableNumber}
          </div>
          <div 
            style={{
              textAlign: 'left',
              fontSize: '15px',
              color: '#f1ddad'
            }}
          >
            {seat.shortId}
          </div>
          <div 
            style={{
              textAlign: 'left',
              fontSize: '16px'
            }}
          >
            {seat.englishName}
            {seat.dietaryNote && (
              <span 
                style={{
                  fontSize: '14px',
                  color: '#f4c7c7',
                  fontStyle: 'italic',
                  marginLeft: '6px'
                }}
              >
                ({seat.dietaryNote})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
