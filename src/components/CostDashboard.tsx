import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CostDashboard as CostDashboardType } from "@/hooks/useChat";
import { DollarSign, Plane, Hotel, Calculator } from "lucide-react";

interface CostDashboardProps {
  data: CostDashboardType;
  conversationId: string | null;
}

const CostDashboard = ({ data, conversationId }: CostDashboardProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !conversationId) return;

    setIsSubmitting(true);
    try {
      await supabase.from("customer_inquiries").insert({
        email,
        conversation_id: conversationId,
        inquiry_type: "cost_estimate",
        status: "pending",
      });

      toast({
        title: "Request Submitted!",
        description: "Our agent will contact the hospital and reach out to you shortly.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CostItem = ({ 
    icon: Icon, 
    label, 
    low, 
    high 
  }: { 
    icon: any; 
    label: string; 
    low: number; 
    high: number;
  }) => (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          {formatCurrency(low)} - {formatCurrency(high)}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full mt-4 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Your Estimated Cost Breakdown
        </CardTitle>
        <CardDescription className="text-base">
          {data.procedure} in {data.destination} • {data.duration}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <CostItem
          icon={DollarSign}
          label="Procedure Cost"
          low={data.procedureCost.low}
          high={data.procedureCost.high}
        />
        <CostItem
          icon={Plane}
          label="Flight Cost (for 2)"
          low={data.flightCost.low}
          high={data.flightCost.high}
        />
        <CostItem
          icon={Hotel}
          label="Hotel Cost"
          low={data.hotelCost.low}
          high={data.hotelCost.high}
        />
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Total Estimated Cost</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">
                {formatCurrency(data.totalCost.low)} - {formatCurrency(data.totalCost.high)}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              These are estimated costs based on current market data. For the most accurate quote 
              tailored to your specific needs, our agent will contact the hospital directly on your behalf.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Ready to proceed? Enter your email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Get Accurate Quote from Hospital"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostDashboard;