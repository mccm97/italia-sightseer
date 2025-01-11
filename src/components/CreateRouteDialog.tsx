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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CreateRouteForm } from '@/components/route/CreateRouteForm';

export function CreateRouteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    console.log('Navigating to blog page');
    setIsOpen(false);
    navigate('/blog');
  };

  const handleCreateRoute = () => {
    console.log('Opening route creation dialog');
    setIsOpen(false);
    setIsDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 hover:scale-105 transition-transform shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="top" 
          className="mb-2"
          sideOffset={16}
        >
          <DropdownMenuItem 
            onClick={handleCreatePost}
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <PenLine className="mr-2 h-4 w-4" />
            Nuovo Post
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleCreateRoute}
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Nuovo Percorso
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <CreateRouteForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}