import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
  isSelected?: boolean;
  onClick?: () => void;
}

export function StatCard({ title, value, Icon, isSelected, onClick }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:bg-accent",
        isSelected && "border-primary bg-accent"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn(
          "h-4 w-4 text-muted-foreground",
          isSelected && "text-primary"
        )} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}