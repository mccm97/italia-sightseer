import { useState } from 'react';
import { Plus, PenLine, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function CreateRouteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side="top" 
        className="mb-2 animate-slide-up"
      >
        <DropdownMenuItem onClick={() => navigate('/blog/new')}>
          <PenLine className="mr-2 h-4 w-4" />
          Nuovo Post
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsOpen(true)}>
          <MapPin className="mr-2 h-4 w-4" />
          Nuovo Percorso
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}