import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Estimate {
  totalLow: number;
  totalHigh: number;
  currency: string;
  breakdown?: {
    category: string;
    cost: string;
  }[];
}

interface EstimateCardProps {
  estimate: Estimate;
}

const EstimateCard = ({ estimate }: EstimateCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate("/cost-breakdown", { state: { estimate } });
  };

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Cost Estimate</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {estimate.currency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-center gap-2 py-6">
          <span className="text-4xl font-bold text-primary">
            ${estimate.totalLow.toLocaleString()}
          </span>
          <span className="text-2xl text-muted-foreground">-</span>
          <span className="text-4xl font-bold text-primary">
            ${estimate.totalHigh.toLocaleString()}
          </span>
        </div>
        
        {estimate.breakdown && estimate.breakdown.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Cost Breakdown
              </h4>
              {estimate.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-foreground">{item.category}</span>
                  <span className="font-semibold text-foreground">{item.cost}</span>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="pt-4">
          <Button 
            onClick={handleViewDetails}
            className="w-full group"
            size="lg"
          >
            View Detailed Breakdown
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateCard;
