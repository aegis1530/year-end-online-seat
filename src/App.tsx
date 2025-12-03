import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SeatList } from './components/SeatList';
import { AddSeatForm } from './components/AddSeatForm';

export interface Seat {
  id: string;
  shortId: string;
  tableNumber: string;
}

export default function App() {
  const [seats, setSeats] = useState<Seat[]>([
    { id: '1', shortId: 'A1B2', tableNumber: '101' },
    { id: '2', shortId: 'C3D4', tableNumber: '102' },
    { id: '3', shortId: 'E5F6', tableNumber: '201' },
    { id: '4', shortId: 'G7H8', tableNumber: '202' },
    { id: '5', shortId: 'I9J0', tableNumber: '301' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // 模糊搜尋邏輯
  const filteredSeats = seats.filter((seat) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      seat.shortId.toLowerCase().includes(query) ||
      seat.tableNumber.toLowerCase().includes(query)
    );
  });

  const handleAddSeat = (newSeat: Omit<Seat, 'id'>) => {
    const seat: Seat = {
      ...newSeat,
      id: Date.now().toString(),
    };
    setSeats([...seats, seat]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-2 drop-shadow-lg">🍽️ 餐廳座位搜尋系統</h1>
          <p className="text-white/90">輸入短ID或桌號來搜尋座位資訊</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-4 border-yellow-300">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Add Seat Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-4 border-green-300">
          <h2 className="text-purple-600 mb-4">✨ 新增座位</h2>
          <AddSeatForm onAddSeat={handleAddSeat} />
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-blue-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-pink-600">🔍 搜尋結果</h2>
            <span className="text-purple-600 bg-purple-100 px-4 py-1 rounded-full">
              共 {filteredSeats.length} 筆結果
            </span>
          </div>
          <SeatList seats={filteredSeats} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}