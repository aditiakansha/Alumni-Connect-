import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DirectoryPage from './pages/DirectoryPage';
import EventsPage from './pages/EventsPage';
import DiscussionsPage from './pages/DiscussionsPage';
import JobsPage from './pages/JobsPage';
import ReferralsPage from './pages/ReferralsPage';

export default function App() {
  const [userRole, setUserRole] = useState('student');
  const isAdmin = userRole === 'admin';

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA] pb-20 selection:bg-[#ffc002] selection:text-[#002148]">
        <div className="bg-[#002148] text-white text-xs px-6 py-2 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Role View:</span>
            <span className="font-bold uppercase tracking-wider text-[#ffc002]">
              {isAdmin ? 'Admin (Full CRUD Enabled)' : 'Public / Student (Read-Only)'}
            </span>
          </div>
          <button
            onClick={() => setUserRole(isAdmin ? 'student' : 'admin')}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[11px] font-medium transition-colors"
          >
            Switch to {isAdmin ? 'Public View' : 'Admin View'}
          </button>
        </div>

        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/directory" replace />} />
          <Route path="/directory" element={<DirectoryPage isAdmin={isAdmin} />} />
          <Route path="/events" element={<EventsPage isAdmin={isAdmin} />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/jobs" element={<JobsPage isAdmin={isAdmin} />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="*" element={<Navigate to="/directory" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}