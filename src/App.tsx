import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SeatList } from './components/SeatList';
import mediaSeatsCSV from './assets/media_seats.csv?raw';
import ecSeatsCSV from './assets/ec_seats.csv?raw';

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

// 統計資料介面
export interface TableStats {
  meatCount: number;
  vegetarianCount: number;
  tables: string[];
}

export default function App() {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);

  // 搜尋：支援 shortId（精確匹配）或桌號（列出該桌所有人）
  const filteredSeats = seats.filter((seat) => {
    if (!searchQuery.trim()) return false; // 沒有搜尋條件時不顯示任何結果
    const query = searchQuery.trim().toLowerCase();
    
    // 特殊處理：桌號0顯示統計
    if (query === '0') {
      return false;
    }
    
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
    
    // 檢查是否輸入桌號0，需要顯示統計資料
    if (query.trim() === '0') {
      setShowStats(true);
      calculateStats();
    } else {
      setShowStats(false);
    }
  };

  // 計算統計資料
  const calculateStats = () => {
    // 按桌號分組
    const tableMap = new Map<string, { meat: number; vegetarian: number }>();
    
    seats.forEach((seat) => {
      if (!seat.tableNumber || !seat.shortId) return;
      
      if (!tableMap.has(seat.tableNumber)) {
        tableMap.set(seat.tableNumber, { meat: 0, vegetarian: 0 });
      }
      
      const stats = tableMap.get(seat.tableNumber)!;
      // 判斷是否為素食：備註中包含"素"字
      if (seat.dietaryNote && seat.dietaryNote.includes('素')) {
        stats.vegetarian++;
      } else {
        stats.meat++;
      }
    });
    
    // 按葷素組合分組
    const statsMap = new Map<string, string[]>();
    
    tableMap.forEach((stats, tableNumber) => {
      const key = `${stats.meat},${stats.vegetarian}`;
      if (!statsMap.has(key)) {
        statsMap.set(key, []);
      }
      statsMap.get(key)!.push(tableNumber);
    });
    
    // 轉換為陣列並排序
    const result: TableStats[] = [];
    statsMap.forEach((tables, key) => {
      const [meat, vegetarian] = key.split(',').map(Number);
      // 桌號由小到大排序（數字排序）
      tables.sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      });
      result.push({
        meatCount: meat,
        vegetarianCount: vegetarian,
        tables
      });
    });
    
    // 按照葷食數量降序，素食數量升序排序
    result.sort((a, b) => {
      if (a.meatCount !== b.meatCount) {
        return b.meatCount - a.meatCount;
      }
      return a.vegetarianCount - b.vegetarianCount;
    });
    
    setTableStats(result);
  };

  const handleAddSeat = (newSeat: Omit<Seat, 'id'>) => {
    const seat: Seat = {
      ...newSeat,
      id: Date.now().toString(),
    };
    setSeats([...seats, seat]);
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center"
      style={{
        fontFamily: '"Times New Roman", "Noto Serif TC", serif',
        background: 'radial-gradient(circle at top, #3a1b33 0%, #12040f 45%, #050108 100%)',
        color: '#f8e9b8'
      }}
    >
      <div 
        className="relative overflow-hidden"
        style={{
          width: '414px',
          maxWidth: '100%',
          padding: '24px 18px 32px',
          background: 'radial-gradient(circle at top, #2a101b 0%, #12050d 50%, #080308 100%)',
          borderRadius: '28px',
          border: '1px solid #cfa350',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 215, 128, 0.25)'
        }}
      >
        {/* 角落裝飾 */}
        <div 
          className="absolute"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '100%',
            border: '2px solid rgba(223, 181, 96, 0.8)',
            filter: 'blur(0.2px)',
            opacity: 0.8,
            top: '-32px',
            left: '-32px'
          }}
        ></div>
        <div 
          className="absolute"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '100%',
            border: '2px solid rgba(223, 181, 96, 0.8)',
            filter: 'blur(0.2px)',
            opacity: 0.8,
            top: '-32px',
            right: '-32px'
          }}
        ></div>
        <div 
          className="absolute"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '100%',
            border: '2px solid rgba(223, 181, 96, 0.8)',
            filter: 'blur(0.2px)',
            opacity: 0.8,
            bottom: '-32px',
            left: '-32px'
          }}
        ></div>
        <div 
          className="absolute"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '100%',
            border: '2px solid rgba(223, 181, 96, 0.8)',
            filter: 'blur(0.2px)',
            opacity: 0.8,
            bottom: '-32px',
            right: '-32px'
          }}
        ></div>

        {/* 標題 */}
        <h1 
          className="text-center relative"
          style={{
            fontSize: '28px',
            letterSpacing: '0.24em',
            color: '#f4e1a8',
            marginBottom: '24px',
            textShadow: '0 0 8px rgba(0, 0, 0, 0.9)'
          }}
        >
          <span style={{ position: 'relative' }}>
            <span 
              style={{
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '0',
                width: '20%',
                height: '1px',
                background: 'linear-gradient(to right, rgba(207, 163, 80, 0), rgba(207, 163, 80, 0.8), rgba(207, 163, 80, 0))',
                transform: 'translateY(-50%) translateX(-120%)'
              }}
            ></span>
            座位搜尋
            <span 
              style={{
                content: '""',
                position: 'absolute',
                top: '50%',
                right: '0',
                width: '20%',
                height: '1px',
                background: 'linear-gradient(to right, rgba(207, 163, 80, 0), rgba(207, 163, 80, 0.8), rgba(207, 163, 80, 0))',
                transform: 'translateY(-50%) translateX(120%)'
              }}
            ></span>
          </span>
        </h1>

        {/* 搜尋區塊 */}
        <SearchBar onSearch={handleSearch} />

        {/* 搜尋結果標題 */}
        <div 
          className="text-center relative"
          style={{
            fontSize: '20px',
            color: '#f2dfb1',
            margin: '8px 0 14px'
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span 
              style={{
                content: '""',
                position: 'absolute',
                top: '50%',
                width: '60px',
                height: '1px',
                background: 'linear-gradient(to right, rgba(207, 163, 80, 0), rgba(207, 163, 80, 0.9), rgba(207, 163, 80, 0))',
                transform: 'translateY(-50%) translateX(-70px)'
              }}
            ></span>
            {showStats ? '統計資料' : `搜尋結果${filteredSeats.length > 0 ? `共 ${filteredSeats.length} 個` : ''}`}
            <span 
              style={{
                content: '""',
                position: 'absolute',
                top: '50%',
                width: '60px',
                height: '1px',
                background: 'linear-gradient(to right, rgba(207, 163, 80, 0), rgba(207, 163, 80, 0.9), rgba(207, 163, 80, 0))',
                transform: 'translateY(-50%) translateX(10px)'
              }}
            ></span>
          </span>
        </div>

        {/* 結果卡片 */}
        <SeatList 
          seats={filteredSeats} 
          searchQuery={searchQuery} 
          showStats={showStats}
          tableStats={tableStats}
        />
      </div>
    </div>
  );
}