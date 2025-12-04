import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CostBreakdownChartProps {
  procedureCost: number;
  hotelCost: number;
  flightCost: number;
  otherCosts: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(221, 83%, 53%)', 'hsl(var(--muted-foreground))'];

const CostBreakdownChart = ({ procedureCost, hotelCost, flightCost, otherCosts }: CostBreakdownChartProps) => {
  const data = [
    { name: 'Procedure', value: procedureCost, fill: COLORS[0] },
    { name: 'Hotel (7 nights)', value: hotelCost, fill: COLORS[1] },
    { name: 'Flights', value: flightCost, fill: COLORS[2] },
    { name: 'Other', value: otherCosts, fill: COLORS[3] },
  ];

  const total = procedureCost + hotelCost + flightCost + otherCosts;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">${data.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cost Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
          <p className="text-2xl font-bold text-primary">${total.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownChart;
