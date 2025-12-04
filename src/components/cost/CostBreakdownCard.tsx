import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Hotel, 
  Plane, 
  Car, 
  Shield, 
  Pill, 
  TestTube,
  CreditCard
} from "lucide-react";

interface CostItem {
  label: string;
  lowEstimate: number;
  highEstimate: number;
  icon: React.ReactNode;
  included?: boolean;
}

interface CostBreakdownCardProps {
  procedure: string;
  procedureCostLow: number;
  procedureCostHigh: number;
  hotelCostLow?: number;
  hotelCostHigh?: number;
  flightCostLow?: number;
  flightCostHigh?: number;
}

const CostBreakdownCard = ({
  procedure,
  procedureCostLow,
  procedureCostHigh,
  hotelCostLow = 400,
  hotelCostHigh = 800,
  flightCostLow = 800,
  flightCostHigh = 1500,
}: CostBreakdownCardProps) => {
  const costItems: CostItem[] = [
    { 
      label: 'Procedure Cost', 
      lowEstimate: procedureCostLow, 
      highEstimate: procedureCostHigh,
      icon: <Stethoscope className="h-4 w-4 text-primary" />
    },
    { 
      label: 'Pre-op Tests', 
      lowEstimate: 100, 
      highEstimate: 300,
      icon: <TestTube className="h-4 w-4 text-blue-500" />
    },
    { 
      label: 'Medications', 
      lowEstimate: 50, 
      highEstimate: 150,
      icon: <Pill className="h-4 w-4 text-green-500" />
    },
    { 
      label: 'Clinic Consultation', 
      lowEstimate: 0, 
      highEstimate: 0,
      icon: <Stethoscope className="h-4 w-4 text-teal-500" />,
      included: true
    },
    { 
      label: 'Hotel (7 nights)', 
      lowEstimate: hotelCostLow, 
      highEstimate: hotelCostHigh,
      icon: <Hotel className="h-4 w-4 text-amber-500" />
    },
    { 
      label: 'Round-trip Flights', 
      lowEstimate: flightCostLow, 
      highEstimate: flightCostHigh,
      icon: <Plane className="h-4 w-4 text-indigo-500" />
    },
    { 
      label: 'Local Transport', 
      lowEstimate: 80, 
      highEstimate: 150,
      icon: <Car className="h-4 w-4 text-slate-500" />
    },
    { 
      label: 'Travel Insurance', 
      lowEstimate: 150, 
      highEstimate: 300,
      icon: <Shield className="h-4 w-4 text-rose-500" />
    },
  ];

  const totalLow = costItems.reduce((acc, item) => acc + item.lowEstimate, 0);
  const totalHigh = costItems.reduce((acc, item) => acc + item.highEstimate, 0);
  const midEstimate = Math.round((totalLow + totalHigh) / 2);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Estimated Total</p>
            <CardTitle className="text-3xl font-bold text-foreground">
              ${totalLow.toLocaleString()} – ${totalHigh.toLocaleString()}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-sm">
            {procedure}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-sm">Best estimate: <strong className="text-primary">${midEstimate.toLocaleString()}</strong></span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {costItems.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.included ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Included
                  </Badge>
                ) : (
                  <span className="text-sm font-medium">
                    ${item.lowEstimate.toLocaleString()} – ${item.highEstimate.toLocaleString()}
                  </span>
                )}
              </div>
              {index < costItems.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            * Estimates based on typical costs. Actual prices may vary based on clinic selection and travel dates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdownCard;
