import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface PaymentTimelineProps {
  totalCost: number;
  depositPaid?: boolean;
  preProcedurePaid?: boolean;
  finalPaid?: boolean;
}

const PaymentTimeline = ({ 
  totalCost, 
  depositPaid = false, 
  preProcedurePaid = false, 
  finalPaid = false 
}: PaymentTimelineProps) => {
  const deposit = Math.round(totalCost * 0.2);
  const preProcedure = Math.round(totalCost * 0.5);
  const final = Math.round(totalCost * 0.3);

  const data = [
    { name: 'Deposit', amount: deposit, percentage: '20%', timing: 'On booking', paid: depositPaid },
    { name: 'Pre-Procedure', amount: preProcedure, percentage: '50%', timing: '1 week before', paid: preProcedurePaid },
    { name: 'Final', amount: final, percentage: '30%', timing: 'After procedure', paid: finalPaid },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{d.name} ({d.percentage})</p>
          <p className="text-primary font-bold">${d.amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{d.timing}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide domain={[0, Math.max(...data.map(d => d.amount))]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={90}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.paid ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {item.paid ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
                {index < data.length - 1 && (
                  <div className={`w-0.5 h-8 ${item.paid ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${item.paid ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.name} <span className="text-xs">({item.percentage})</span>
                  </p>
                  <p className={`font-bold ${item.paid ? 'text-primary' : 'text-muted-foreground'}`}>
                    ${item.amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.timing}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTimeline;
