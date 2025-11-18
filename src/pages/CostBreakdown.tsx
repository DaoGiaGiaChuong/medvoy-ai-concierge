import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle, Plane, Hotel, Activity, Calculator, Home, Search, MessageSquare } from "lucide-react";

const CostBreakdown = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get estimate data from navigation state or use sample data
  const defaultEstimate = {
    procedure: { low: 3000, high: 8000, name: "Knee Surgery" },
    flights: { low: 3000, high: 6000, name: "Round-trip Flights (2 people)" },
    hotel: { low: 350, high: 1400, name: "Hotel Accommodation (7-14 days)" },
    total: { low: 6350, high: 15400 },
    currency: "USD",
    country: "Thailand",
    budget: 5000,
  };

  const passedEstimate = location.state?.estimate;
  
  // If estimate data is passed, transform it to match our expected format
  const estimate = passedEstimate ? {
    procedure: { 
      low: passedEstimate.breakdown?.[0] ? parseFloat(passedEstimate.breakdown[0].cost.replace(/[^0-9.-]+/g, "").split('-')[0]) : 3000,
      high: passedEstimate.breakdown?.[0] ? parseFloat(passedEstimate.breakdown[0].cost.replace(/[^0-9.-]+/g, "").split('-')[1]) : 8000,
      name: passedEstimate.breakdown?.[0]?.category || "Medical Procedure"
    },
    flights: { 
      low: passedEstimate.breakdown?.[1] ? parseFloat(passedEstimate.breakdown[1].cost.replace(/[^0-9.-]+/g, "").split('-')[0]) : 3000,
      high: passedEstimate.breakdown?.[1] ? parseFloat(passedEstimate.breakdown[1].cost.replace(/[^0-9.-]+/g, "").split('-')[1]) : 6000,
      name: passedEstimate.breakdown?.[1]?.category || "Round-trip Flights"
    },
    hotel: { 
      low: passedEstimate.breakdown?.[2] ? parseFloat(passedEstimate.breakdown[2].cost.replace(/[^0-9.-]+/g, "").split('-')[0]) : 350,
      high: passedEstimate.breakdown?.[2] ? parseFloat(passedEstimate.breakdown[2].cost.replace(/[^0-9.-]+/g, "").split('-')[1]) : 1400,
      name: passedEstimate.breakdown?.[2]?.category || "Hotel Accommodation"
    },
    total: { 
      low: passedEstimate.totalLow,
      high: passedEstimate.totalHigh
    },
    currency: passedEstimate.currency,
    country: "Selected Destination",
    budget: 5000,
  } : defaultEstimate;

  const calculatePercentage = (value: number, total: number) => {
    return (value / total) * 100;
  };

  const isOverBudget = estimate.total.low > estimate.budget;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            MedVoy AI
          </h1>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/explore")}>
              <Search className="mr-2 h-4 w-4" />
              Explore
            </Button>
            <Button variant="ghost" onClick={() => navigate("/cost-breakdown")}>
              <Calculator className="mr-2 h-4 w-4" />
              Cost Estimate
            </Button>
            <Button variant="ghost" onClick={() => navigate("/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Cost Breakdown</h1>
            <p className="text-muted-foreground">
              Estimated costs for {estimate.procedure.name} in {estimate.country}
            </p>
          </div>

          {/* Total Estimate Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Total Estimated Cost</CardTitle>
              <CardDescription>Full breakdown including procedure, travel, and accommodation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-center gap-3 py-4">
                <span className="text-5xl font-bold text-primary">
                  ${estimate.total.low.toLocaleString()}
                </span>
                <span className="text-3xl text-muted-foreground">-</span>
                <span className="text-5xl font-bold text-primary">
                  ${estimate.total.high.toLocaleString()}
                </span>
                <span className="text-xl text-muted-foreground">{estimate.currency}</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Badge variant={isOverBudget ? "destructive" : "secondary"}>
                  Your Budget: ${estimate.budget.toLocaleString()} {estimate.currency}
                </Badge>
                {isOverBudget && (
                  <Badge variant="outline" className="border-destructive/50 text-destructive">
                    Over Budget
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Components */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Procedure Cost */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Procedure</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{estimate.procedure.name}</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${estimate.procedure.low.toLocaleString()} - ${estimate.procedure.high.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>% of Total (Low)</span>
                    <span>{calculatePercentage(estimate.procedure.low, estimate.total.low).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculatePercentage(estimate.procedure.low, estimate.total.low)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Flights Cost */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Flights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{estimate.flights.name}</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${estimate.flights.low.toLocaleString()} - ${estimate.flights.high.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>% of Total (Low)</span>
                    <span>{calculatePercentage(estimate.flights.low, estimate.total.low).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculatePercentage(estimate.flights.low, estimate.total.low)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Hotel Cost */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Accommodation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{estimate.hotel.name}</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${estimate.hotel.low.toLocaleString()} - ${estimate.hotel.high.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>% of Total (Low)</span>
                    <span>{calculatePercentage(estimate.hotel.low, estimate.total.low).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculatePercentage(estimate.hotel.low, estimate.total.low)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Procedure Cost", value: estimate.procedure, icon: Activity },
                  { label: "Flight Cost", value: estimate.flights, icon: Plane },
                  { label: "Hotel Cost", value: estimate.hotel, icon: Hotel },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.value.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          ${item.value.low.toLocaleString()} - ${item.value.high.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {index < 2 && <Separator />}
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between py-2 bg-primary/5 px-4 rounded-lg">
                <p className="text-lg font-bold text-foreground">Total Estimate</p>
                <p className="text-lg font-bold text-primary">
                  ${estimate.total.low.toLocaleString()} - ${estimate.total.high.toLocaleString()} {estimate.currency}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-amber-500">Important Disclaimers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-foreground">
                <strong>These estimates do NOT include:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Visa fees (if applicable)</li>
                <li>Travel insurance (highly recommended)</li>
                <li>Ground transportation in {estimate.country}</li>
                <li>Food and personal expenses</li>
                <li>Post-operative care and medication</li>
                <li>Any potential complications</li>
              </ul>
              <Separator className="my-3" />
              <p className="text-muted-foreground">
                <strong>Please note:</strong> These are approximate estimates. Costs can vary widely depending on the specific type of surgery, hospital, and individual circumstances. The procedure cost range is a general estimate - your specific needs will impact the final price.
              </p>
              {isOverBudget && (
                <>
                  <Separator className="my-3" />
                  <p className="text-amber-700 dark:text-amber-400 font-semibold">
                    ⚠️ Your stated budget may be insufficient for this procedure and travel costs. Consider adjusting your budget or exploring alternative destinations.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/explore")}>
              Explore Hospitals
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Refine Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
