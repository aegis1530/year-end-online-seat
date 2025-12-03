import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Seat } from '../App';

interface AddSeatFormProps {
  onAddSeat: (seat: Omit<Seat, 'id'>) => void;
}

export function AddSeatForm({ onAddSeat }: AddSeatFormProps) {
  const [shortId, setShortId] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortId.trim() && tableNumber.trim()) {
      onAddSeat({ shortId: shortId.trim(), tableNumber: tableNumber.trim() });
      setShortId('');
      setTableNumber('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="短ID (例: A1B2)"
        value={shortId}
        onChange={(e) => setShortId(e.target.value)}
        className="flex-1 px-4 py-2 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 bg-green-50"
        required
      />
      <input
        type="text"
        placeholder="桌號 (例: 101)"
        value={tableNumber}
        onChange={(e) => setTableNumber(e.target.value)}
        className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 bg-blue-50"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap transform hover:scale-105"
      >
        <Plus className="h-5 w-5" />
        新增座位
      </button>
    </form>
  );
}