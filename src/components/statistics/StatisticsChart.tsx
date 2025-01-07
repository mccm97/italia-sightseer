import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { DailyStats } from "@/types/statistics";

interface StatisticsChartProps {
  data: DailyStats[];
}

export function StatisticsChart({ data }: StatisticsChartProps) {
  const chartConfig = {
    visits: {
      label: 'Visite',
      color: '#8884d8',
    },
    routes: {
      label: 'Percorsi',
      color: '#82ca9d',
    },
    likes: {
      label: 'Mi Piace',
      color: '#ffc658',
    },
    reviews: {
      label: 'Recensioni',
      color: '#ff7300',
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Andamento nel Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={chartConfig}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="visits_count"
                name="Visite"
                stroke={chartConfig.visits.color}
              />
              <Line
                type="monotone"
                dataKey="routes_created"
                name="Percorsi"
                stroke={chartConfig.routes.color}
              />
              <Line
                type="monotone"
                dataKey="likes_count"
                name="Mi Piace"
                stroke={chartConfig.likes.color}
              />
              <Line
                type="monotone"
                dataKey="reviews_count"
                name="Recensioni"
                stroke={chartConfig.reviews.color}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}