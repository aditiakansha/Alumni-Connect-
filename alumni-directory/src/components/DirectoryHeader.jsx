import React from 'react';

export default function DirectoryHeader({ totalCount }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#ffc002] block mb-2">
          Global Network
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#002148]">
          Alumni Directory<span className="text-[#ffc002]">.</span>
        </h1>
      </div>
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-[#002148]">{totalCount}</span> verified profiles
      </div>
    </div>
  );
}