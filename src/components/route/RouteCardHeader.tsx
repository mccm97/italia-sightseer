import { CardHeader, CardTitle } from '@/components/ui/card';

interface RouteCardHeaderProps {
  name: string;
  routeId: string;
  creatorUsername?: string;
}

export function RouteCardHeader({
  name,
  creatorUsername,
}: RouteCardHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-sm text-muted-foreground">
            Creato da: {creatorUsername || 'Utente anonimo'}
          </span>
        </div>
      </CardTitle>
    </CardHeader>
  );
}