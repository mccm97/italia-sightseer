import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function MainMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Link to="/" className="text-lg hover:underline">Home</Link>
          <Link to="/profile" className="text-lg hover:underline">Profilo</Link>
          <Link to="/upgrade" className="text-lg hover:underline">Abbonamenti</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}