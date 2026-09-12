import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilters({ searchTerm, setSearchTerm, domains, selectedDomain, setSelectedDomain }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, role, company, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-[#002148] focus:ring-1 focus:ring-[#002148] transition-colors shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDomain === domain
                ? 'bg-[#002148] text-white shadow-sm font-bold'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>
    </div>
  );
}