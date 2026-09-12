import React from 'react';
import { Plus } from 'lucide-react';

export default function Navbar({ isAdmin, onAddClick }) {
  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#002148] text-white flex items-center justify-center font-serif font-black shadow-md shadow-[#002148]/20">
            V
          </span>
          <span className="font-serif font-bold text-lg tracking-tight text-[#002148]">
            AlumniConnect
          </span>
        </div>

        {isAdmin && (
          <button 
            onClick={onAddClick}
            className="inline-flex items-center gap-2 bg-[#002148] hover:bg-[#001733] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-md shadow-[#002148]/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add Alumni
          </button>
        )}
      </div>
    </header>
  );
}