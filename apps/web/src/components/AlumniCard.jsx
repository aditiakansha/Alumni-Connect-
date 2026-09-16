import React from 'react';
import { Edit3, Trash2, GraduationCap, MapPin, Briefcase } from 'lucide-react';

export default function AlumniCard({ item, isAdmin, onEdit, onDelete, onCardClick }) {
  return (
    <div 
      onClick={() => onCardClick(item)}
      className="group relative bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#002148]/40 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002148] via-[#00387a] to-[#ffc002]" />

      <div>
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 bg-slate-100">
          <img
            src={item.avatar}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#002148]/90 backdrop-blur-md border border-white/20 text-[#ffc002] rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {item.field}
          </span>

          {isAdmin && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-2 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 rounded-xl shadow-md"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2 bg-white/95 backdrop-blur-md hover:bg-red-600 text-slate-700 hover:text-white rounded-xl shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <h2 className="font-serif text-xl font-bold text-[#002148] leading-snug">
          {item.name}
        </h2>
        
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#002148] mt-1 mb-0.5">
          <Briefcase className="w-3.5 h-3.5 text-[#ffc002]" />
          <span>{item.role}</span>
        </div>
        <p className="text-xs font-medium text-slate-500 mb-3">{item.company}</p>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5">
          {item.bio}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#002148]" />
          <span>{item.degree} • Class of {item.graduationYear}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#ffc002]" />
          <span>{item.location}</span>
        </div>
      </div>
    </div>
  );
}