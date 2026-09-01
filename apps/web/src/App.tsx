import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Jobs from './pages/Jobs';
import Discussions from './pages/Discussions';
import Referrals from './pages/Referrals';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex space-x-6">
          <Link to="/jobs" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Jobs & Internships
          </Link>
          <Link to="/discussions" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Discussions
          </Link>
          <Link to="/referrals" className="text-slate-700 hover:text-indigo-600 font-semibold transition-colors">
            Referrals
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>
    </BrowserRouter>
  );
}