import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Directory', path: '/directory', icon: Users },
    { name: 'Events & Hackathons', path: '/events', icon: Calendar }
  ];

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/directory" className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#002148] text-white flex items-center justify-center font-serif font-black shadow-md shadow-[#002148]/20">
            V
          </span>
          <span className="font-serif font-bold text-lg tracking-tight text-[#002148]">
            AlumniConnect
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#002148] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}