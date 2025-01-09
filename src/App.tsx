import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import Statistics from './pages/Statistics';
import Admin from './pages/Admin';
import Upgrade from './pages/Upgrade';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<Blog />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/upgrade" element={<Upgrade />} />
    </Routes>
  );
}

export default App;