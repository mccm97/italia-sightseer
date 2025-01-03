import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route } from 'react-router-dom';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Upgrade from '@/pages/Upgrade';
import { MainMenu } from '@/components/MainMenu';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainMenu />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upgrade" element={<Upgrade />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;