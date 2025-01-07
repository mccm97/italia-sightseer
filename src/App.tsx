import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Index } from '@/pages/Index';
import { Statistics } from '@/pages/Statistics';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { Admin } from '@/pages/Admin';
import { Upgrade } from '@/pages/Upgrade';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/upgrade" element={<Upgrade />} />
      </Routes>
    </Router>
  );
}

export default App;