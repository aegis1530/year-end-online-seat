import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SeatList } from './components/SeatList';
import mediaSeatsCSV from './rawdata/media_seats.csv?raw';
import ecSeatsCSV from './rawdata/ec_seats.csv?raw';

export interface Seat {
  id: string;
  shortId: string;
  tableNumber: string;
  englishName: string;
  dietaryNote: string;
}

// 解析 CSV 單行（處理引號內的逗號）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// 解析 CSV 資料（不含 id）
function parseSeatsCSVRaw(csvString: string): Omit<Seat, 'id'>[] {
  const lines = csvString.trim().split('\n');
  // 跳過標題行
  return lines.slice(1).map((line) => {
    const [tableNumber, shortId, englishName, dietaryNote] = parseCSVLine(line);
    return { 
      shortId: shortId || '', 
      tableNumber: tableNumber || '',
      englishName: englishName || '',
      dietaryNote: dietaryNote || ''
    };
  });
}

// 合併兩個 CSV 資料，ec_seats 中不重複的 shortId 會被加入
function mergeSeats(): Seat[] {
  const mediaSeats = parseSeatsCSVRaw(mediaSeatsCSV);
  const ecSeats = parseSeatsCSVRaw(ecSeatsCSV);
  
  // 建立 media seats 的 shortId Set（小寫，用於比對）
  const existingShortIds = new Set(
    mediaSeats
      .filter(s => s.shortId)
      .map(s => s.shortId.toLowerCase())
  );
  
  // 篩選 ec_seats 中不重複的 shortId
  const uniqueEcSeats = ecSeats.filter(
    s => s.shortId && !existingShortIds.has(s.shortId.toLowerCase())
  );
  
  // 合併並加上 id
  const allSeats = [...mediaSeats, ...uniqueEcSeats];
  return allSeats.map((seat, index) => ({
    ...seat,
    id: String(index + 1)
  }));
}

const initialSeats = mergeSeats();

export default function App() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [searchQuery, setSearchQuery] = useState('');

  // 搜尋：支援 shortId（精確匹配）或桌號（列出該桌所有人）
  const filteredSeats = seats.filter((seat) => {
    if (!searchQuery.trim()) return false; // 沒有搜尋條件時不顯示任何結果
    const query = searchQuery.trim().toLowerCase();
    
    // 精確匹配 shortId
    if (seat.shortId && seat.shortId.toLowerCase() === query) {
      return true;
    }
    
    // 匹配桌號（只顯示有 shortId 的座位）
    if (seat.tableNumber === query && seat.shortId) {
      return true;
    }
    
    return false;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddSeat = (newSeat: Omit<Seat, 'id'>) => {
    const seat: Seat = {
      ...newSeat,
      id: Date.now().toString(),
    };
    setSeats([...seats, seat]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* 3D 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10" style={{ perspective: '1000px' }}>
        {/* Header */}
        <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-300">
          <h1 className="text-white mb-3 drop-shadow-2xl" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)' }}>
            🍽️ 餐廳座位搜尋系統
          </h1>
          <p className="text-white/95 drop-shadow-lg">輸入短ID或桌號來搜尋座位資訊</p>
        </div>

        {/* Search Section */}
        <div 
          className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-3xl p-8 mb-8 transform hover:translate-y-[-8px] transition-all duration-300"
          style={{ 
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
            transform: 'rotateX(2deg)'
          }}
        >
          <SearchBar 
            onSearch={handleSearch}
          />
        </div>

        {/* Results Section */}
        <div 
          className="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-3xl p-8 transform hover:translate-y-[-8px] transition-all duration-300"
          style={{ 
            boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
            transform: 'rotateX(2deg)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-pink-700 drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
              🔍 搜尋結果
            </h2>
            <span 
              className="text-purple-700 bg-white px-6 py-2 rounded-full shadow-lg"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 -2px 5px rgba(0,0,0,0.1)' }}
            >
              共 {filteredSeats.length} 筆結果
            </span>
          </div>
          <SeatList seats={filteredSeats} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}