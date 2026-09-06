import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // swap for your router if different

interface AppShellProps {
  children: React.ReactNode;
}

const TABS = [
  { label: 'Discussions', path: '/discussions' },
  { label: 'Jobs & Internships', path: '/jobs' },
  { label: 'Referrals', path: '/referrals' },
];

const NAV_ITEMS = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Discussions', icon: '💬', path: '/discussions' },
  { label: 'Jobs', icon: '💼', path: '/jobs' },
  { label: 'Referrals', icon: '🤝', path: '/referrals' },
  { label: 'Profile', icon: '👤', path: '/profile' },
];

export default function AppShell({ children }: AppShellProps) {
  const location = useLocation();

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-slate-50">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            AC
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">Alumni Network</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">by 24</span>
            </div>
            <p className="text-[11px] text-slate-400">Global Alumni Chapter</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-slate-400 text-lg">🔔</button>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            VK
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex bg-white border-b border-slate-100 px-2">
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 text-center py-3 text-sm font-semibold border-b-2 transition-colors ${
                isActive
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div className="pb-20">{children}</div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2 relative">
          {NAV_ITEMS.map((item, i) => {
            const isActive = location.pathname === item.path;
            if (i === Math.floor(NAV_ITEMS.length / 2)) {
              return (
                <React.Fragment key={item.path}>
                  <Link to={item.path} className="flex flex-col items-center gap-0.5 px-2">
                    <span className={`text-xl ${isActive ? '' : 'opacity-40'}`}>{item.icon}</span>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {item.label}
                    </span>
                  </Link>
                </React.Fragment>
              );
            }
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-0.5 px-2">
                <span className={`text-xl ${isActive ? '' : 'opacity-40'}`}>{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating action button */}
      <Link
        to="/post"
        className="fixed bottom-16 right-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg text-2xl font-light hover:bg-indigo-700 transition-colors"
      >
        +
      </Link>
    </div>
  );
}