import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Index from '@/pages/Index';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
    </RouterRoutes>
  );
}