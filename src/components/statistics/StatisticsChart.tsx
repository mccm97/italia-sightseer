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
  console.log('Chart data:', data); // Debug log to verify data

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

  // Format data to ensure all required fields are present
  const formattedData = data.map(day => ({
    ...day,
    visits_count: day.visits_count || 0,
    likes_count: day.likes_count || 0,
    reviews_count: day.reviews_count || 0,
    routes_created: day.routes_created || 0,
  }));

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
        <div className="h-[500px] w-full p-4"> {/* Increased height and added padding */}
          <ChartContainer
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={formattedData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {selectedStat ? (
                  <Line
                    type="monotone"
                    dataKey={selectedStat}
                    name={chartConfig[selectedStat].label}
                    stroke={chartConfig[selectedStat].color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ) : (
                  Object.entries(chartConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={config.label}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}