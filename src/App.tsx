import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/CookieConsent';
import { Analytics } from '@vercel/analytics/react';
import { Routes } from '@/Routes';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
        <Toaster />
        <CookieBanner />
        <Analytics />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;