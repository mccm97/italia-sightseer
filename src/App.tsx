import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { MainMenu } from '@/components/MainMenu';
import { AuthButton } from '@/components/auth/AuthButton';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Statistics from '@/pages/Statistics';
import Upgrade from '@/pages/Upgrade';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainMenu />
        <AuthButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;