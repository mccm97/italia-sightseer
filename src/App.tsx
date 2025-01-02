import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthButton } from './components/auth/AuthButton';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;