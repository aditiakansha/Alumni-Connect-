import React from 'react';
import { X, ExternalLink, GraduationCap, MapPin, Briefcase } from 'lucide-react';

export default function AlumniDetailModal({ alumni, onClose }) {
  if (!alumni) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#002148]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 bg-[#002148] overflow-hidden">
          <img 
            src={alumni.avatar} 
            alt={alumni.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002148] via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 bg-[#ffc002] text-[#002148] font-bold text-[10px] tracking-wider uppercase rounded-full shadow-sm">
              {alumni.field}
            </span>
            <h3 className="font-serif text-2xl font-bold text-white mt-2 leading-tight">
              {alumni.name}
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center gap-2 text-[#002148] font-semibold text-sm">
            <Briefcase className="w-4 h-4 text-[#ffc002]" />
            <span>{alumni.role} • <span className="text-slate-700 font-medium">{alumni.company}</span></span>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed font-light">
            {alumni.bio}
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-600 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#002148]" />
              <span>{alumni.degree} — Class of {alumni.graduationYear}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#ffc002]" />
              <span>{alumni.location}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <a 
              href={alumni.linkedinUrl || 'https://linkedin.com'} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#002148] hover:bg-[#001733] text-white rounded-2xl font-semibold text-xs transition-all"
            >
              <span>View LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}