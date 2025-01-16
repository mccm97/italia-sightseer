import { Plus, PenLine, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CreateActionsMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: () => void;
  onCreateRoute: () => void;
}

export function CreateActionsMenu({
  isOpen,
  onOpenChange,
  onCreatePost,
  onCreateRoute
}: CreateActionsMenuProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
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
          onClick={onCreatePost}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <PenLine className="mr-2 h-4 w-4" />
          {t('blog.newPost')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onCreateRoute}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {t('menu.newRoute')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}