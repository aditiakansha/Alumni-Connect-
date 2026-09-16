import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Jobs from './pages/Jobs';
import Discussions from './pages/Discussions';
import Referrals from './pages/Referrals';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>
    </BrowserRouter>
  );
}