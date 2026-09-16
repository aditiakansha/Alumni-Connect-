import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, MessageSquare, BriefcaseBusiness, Handshake, LogIn, X } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Navbar() {
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks = [
    { name: 'Directory', path: '/directory', icon: Users },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Discussions', path: '/discussions', icon: MessageSquare },
    { name: 'Jobs', path: '/jobs', icon: BriefcaseBusiness },
    { name: 'Referrals', path: '/referrals', icon: Handshake }
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

        <div className="flex items-center gap-2 max-w-[72%]">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#002148] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#ffc002] px-3 py-2 text-xs font-bold text-[#002148] transition-colors hover:bg-[#ffc002]"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Log in</span>
        </button>
        </div>
      </div>
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002148]/45 p-6" onClick={() => setIsLoginOpen(false)}>
          <section className="panel relative w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <button className="absolute right-5 top-5 text-slate-400 hover:text-[#002148]" onClick={() => setIsLoginOpen(false)} aria-label="Close login dialog">
              <X className="w-5 h-5" />
            </button>
            <span className="eyebrow">Welcome back to the network</span>
            <h2 className="page-title text-3xl">Sign in<span className="text-[#ffc002]">.</span></h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Use your Google account to continue to AlumniConnect.</p>
            <button
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#002148] shadow-sm transition hover:border-[#ffc002] hover:bg-[#fffaf0]"
              onClick={() => {
                if (!GOOGLE_CLIENT_ID) {
                  window.alert('Google sign-in is not configured yet. Add VITE_GOOGLE_CLIENT_ID to the root .env file.');
                  return;
                }
                window.alert('Google sign-in is configured for client ID ' + GOOGLE_CLIENT_ID.slice(0, 12) + '... Connect the OAuth callback to finish authentication.');
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 font-serif font-bold text-[#4285F4]">G</span>
              Sign in with Google
            </button>
            <p className="mt-4 text-center text-[11px] text-slate-400">Your Google client secret belongs on the API server only.</p>
          </section>
        </div>
      )}
    </header>
  );
}