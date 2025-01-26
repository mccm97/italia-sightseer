import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { CookieBanner } from '@/components/CookieConsent';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Profile from '@/pages/Profile';
import Statistics from '@/pages/Statistics';
import Admin from '@/pages/Admin';
import Upgrade from '@/pages/Upgrade';
import Login from '@/pages/Login';
import { Footer } from './components/layout/Footer';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <PWAInstallPrompt />
            <CookieBanner />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;