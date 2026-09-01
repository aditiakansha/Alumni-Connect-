import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Jobs from './pages/Jobs';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  );
}