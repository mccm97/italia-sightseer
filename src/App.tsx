import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Index';
import { Blog } from './pages/Blog';
import { Profile } from './pages/Profile';
import { Statistics } from './pages/Statistics';
import { Admin } from './pages/Admin';
import { Upgrade } from './pages/Upgrade';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;