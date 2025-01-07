import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { DailyStats } from "@/types/statistics";

interface StatisticsChartProps {
  data: DailyStats[];
  selectedStat?: keyof Pick<DailyStats, 'visits_count' | 'routes_created' | 'likes_count' | 'reviews_count'>;
}

export function StatisticsChart({ data, selectedStat }: StatisticsChartProps) {
  const chartConfig = {
    visits_count: {
      label: 'Visite',
      color: '#8884d8',
    },
    routes_created: {
      label: 'Percorsi',
      color: '#82ca9d',
    },
    likes_count: {
      label: 'Mi Piace',
      color: '#ffc658',
    },
    reviews_count: {
      label: 'Recensioni',
      color: '#ff7300',
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {selectedStat 
            ? `Andamento ${chartConfig[selectedStat].label}`
            : 'Andamento nel Tempo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              {selectedStat ? (
                <Line
                  type="monotone"
                  dataKey={selectedStat}
                  name={chartConfig[selectedStat].label}
                  stroke={chartConfig[selectedStat].color}
                  strokeWidth={2}
                />
              ) : (
                Object.entries(chartConfig).map(([key, config]) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={config.label}
                    stroke={config.color}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}