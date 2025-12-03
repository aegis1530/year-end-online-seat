import { Seat } from '../App';
import { Armchair } from 'lucide-react';

interface SeatListProps {
  seats: Seat[];
  searchQuery: string;
}

const colors = [
  { bg: 'bg-red-100', icon: 'text-red-600', border: 'border-red-300' },
  { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-300' },
  { bg: 'bg-green-100', icon: 'text-green-600', border: 'border-green-300' },
  { bg: 'bg-yellow-100', icon: 'text-yellow-600', border: 'border-yellow-300' },
  { bg: 'bg-purple-100', icon: 'text-purple-600', border: 'border-purple-300' },
  { bg: 'bg-pink-100', icon: 'text-pink-600', border: 'border-pink-300' },
  { bg: 'bg-orange-100', icon: 'text-orange-600', border: 'border-orange-300' },
  { bg: 'bg-teal-100', icon: 'text-teal-600', border: 'border-teal-300' },
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
        <Armchair className="h-16 w-16 text-purple-300 mx-auto mb-3" />
        <p className="text-purple-600">沒有找到符合的座位</p>
        <p className="text-purple-400">請嘗試其他搜尋關鍵字</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {seats.map((seat, index) => {
        const colorScheme = colors[index % colors.length];
        return (
          <div
            key={seat.id}
            className={`flex items-center gap-4 p-4 border-2 ${colorScheme.border} rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all bg-gradient-to-r from-white to-${colorScheme.bg.split('-')[1]}-50`}
          >
            <div className={`flex-shrink-0 w-14 h-14 ${colorScheme.bg} rounded-xl flex items-center justify-center shadow-md`}>
              <Armchair className={`h-7 w-7 ${colorScheme.icon}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-slate-500 mb-1">🏷️ 短ID</div>
                  <div className="text-slate-900">
                    {highlightText(seat.shortId, searchQuery)}
                  </div>
                </div>
                <div className={`h-10 w-1 ${colorScheme.bg} rounded-full`}></div>
                <div>
                  <div className="text-slate-500 mb-1">🪑 桌號</div>
                  <div className="text-slate-900">
                    {highlightText(seat.tableNumber, searchQuery)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}