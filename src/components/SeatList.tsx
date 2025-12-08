import { Seat } from '../App';
import { Armchair } from 'lucide-react';

interface SeatListProps {
  seats: Seat[];
  searchQuery: string;
}

const colors = [
  { bg: 'bg-gradient-to-br from-red-400 to-red-600', icon: 'text-white', shadow: '0 8px 16px rgba(239, 68, 68, 0.4)' },
  { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', icon: 'text-white', shadow: '0 8px 16px rgba(59, 130, 246, 0.4)' },
  { bg: 'bg-gradient-to-br from-green-400 to-green-600', icon: 'text-white', shadow: '0 8px 16px rgba(34, 197, 94, 0.4)' },
  { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', icon: 'text-white', shadow: '0 8px 16px rgba(234, 179, 8, 0.4)' },
  { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', icon: 'text-white', shadow: '0 8px 16px rgba(168, 85, 247, 0.4)' },
  { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', icon: 'text-white', shadow: '0 8px 16px rgba(236, 72, 153, 0.4)' },
  { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', icon: 'text-white', shadow: '0 8px 16px rgba(249, 115, 22, 0.4)' },
  { bg: 'bg-gradient-to-br from-teal-400 to-teal-600', icon: 'text-white', shadow: '0 8px 16px rgba(20, 184, 166, 0.4)' },
];

export function SeatList({ seats, searchQuery }: SeatListProps) {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 text-slate-900 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (seats.length === 0) {
    return (
      <div className="text-center py-12">
        <div 
          className="inline-block p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl mb-4"
          style={{ boxShadow: '0 12px 24px rgba(147, 51, 234, 0.3), inset 0 -4px 8px rgba(0,0,0,0.2)' }}
        >
          <svg className="h-16 w-16 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchQuery ? (
          <>
            <p className="text-purple-800 drop-shadow-sm">沒有找到符合的座位</p>
            <p className="text-purple-600 drop-shadow-sm">請嘗試其他搜尋關鍵字</p>
          </>
        ) : (
          <>
            <p className="text-purple-800 drop-shadow-sm">請輸入短ID或桌號開始搜尋</p>
            <p className="text-purple-600 drop-shadow-sm">例如: dsu03 或 38</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {seats.map((seat, index) => {
        const colorScheme = colors[index % colors.length];
        return (
          <div
            key={seat.id}
            className="flex items-center gap-6 p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-300 bg-white relative"
            style={{ 
              boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              transform: 'translateZ(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
            }}
          >
            <div 
              className={`flex-shrink-0 w-20 h-20 ${colorScheme.bg} rounded-2xl flex items-center justify-center transform hover:scale-110 hover:rotate-12 transition-all duration-300`}
              style={{ 
                boxShadow: `${colorScheme.shadow}, inset 0 -4px 8px rgba(0,0,0,0.2)`,
              }}
            >
              <Armchair className={`h-10 w-10 ${colorScheme.icon}`} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <div className="text-slate-500 mb-2" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
                    🏷️ 短ID
                  </div>
                  <div className="text-slate-900" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
                    {highlightText(seat.shortId, searchQuery)}
                  </div>
                </div>
                <div 
                  className="h-12 w-1 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 rounded-full"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                ></div>
                <div>
                  <div className="text-slate-500 mb-2" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
                    🪑 桌號
                  </div>
                  <div className="text-slate-900" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
                    {highlightText(seat.tableNumber, searchQuery)}
                  </div>
                </div>
                {seat.englishName && (
                  <>
                    <div 
                      className="h-12 w-1 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 rounded-full"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                    ></div>
                    <div>
                      <div className="text-slate-500 mb-2" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
                        👤 英文姓名
                      </div>
                      <div className="text-slate-900" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
                        {seat.englishName}
                      </div>
                    </div>
                  </>
                )}
                {seat.dietaryNote && (
                  <>
                    <div 
                      className="h-12 w-1 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 rounded-full"
                      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                    ></div>
                    <div>
                      <div className="text-slate-500 mb-2" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
                        🍽️ 飲食備註
                      </div>
                      <div className="text-orange-600 font-medium" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>
                        {seat.dietaryNote}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}