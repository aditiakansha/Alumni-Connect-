import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DirectoryPage from './pages/DirectoryPage';
import EventsPage from './pages/EventsPage';
import DiscussionsPage from './pages/DiscussionsPage';
import JobsPage from './pages/JobsPage';
import ReferralsPage from './pages/ReferralsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA] pb-20 selection:bg-[#ffc002] selection:text-[#002148]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<DirectoryPage isAdmin={false} />} />
          <Route path="/events" element={<EventsPage isAdmin={false} />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/jobs" element={<JobsPage isAdmin={false} />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/directory" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
