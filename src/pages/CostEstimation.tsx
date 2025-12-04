import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Download, 
  Share2,
  Clock,
  TrendingDown
} from "lucide-react";
import CostBreakdownCard from "@/components/cost/CostBreakdownCard";
import CostBreakdownChart from "@/components/cost/CostBreakdownChart";
import PaymentTimeline from "@/components/cost/PaymentTimeline";

// Procedure cost data (Vietnam averages)
const PROCEDURE_COSTS: Record<string, { low: number; high: number }> = {
  veneers: { low: 150, high: 400 },
  "dental-implants": { low: 800, high: 1500 },
  rhinoplasty: { low: 2000, high: 4000 },
  "breast-augmentation": { low: 3000, high: 5500 },
  liposuction: { low: 1500, high: 3500 },
  "tummy-tuck": { low: 2500, high: 4500 },
  facelift: { low: 3000, high: 6000 },
  lasik: { low: 1000, high: 2000 },
  ivf: { low: 4000, high: 7000 },
  "hair-transplant": { low: 1500, high: 3500 },
  other: { low: 2000, high: 5000 },
};

const US_COSTS: Record<string, { low: number; high: number }> = {
  veneers: { low: 900, high: 2500 },
  "dental-implants": { low: 3000, high: 6000 },
  rhinoplasty: { low: 8000, high: 15000 },
  "breast-augmentation": { low: 8000, high: 15000 },
  liposuction: { low: 5000, high: 10000 },
  "tummy-tuck": { low: 8000, high: 15000 },
  facelift: { low: 10000, high: 20000 },
  lasik: { low: 4000, high: 6000 },
  ivf: { low: 15000, high: 30000 },
  "hair-transplant": { low: 8000, high: 15000 },
  other: { low: 5000, high: 15000 },
};

const CostEstimation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [intakeData, setIntakeData] = useState<any>(null);

  const procedure = searchParams.get("procedure") || "other";
  const conversationId = searchParams.get("conversation");

  useEffect(() => {
    const loadIntakeData = async () => {
      if (!conversationId) {
        // Use default/demo data if no conversation
        setIntakeData({
          procedure: procedure,
          travel_date: "2024-03-15",
          country: "Vietnam",
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("intake_data")
          .select("*")
          .eq("conversation_id", conversationId)
          .single();

        if (error) throw error;
        setIntakeData(data);
      } catch (error) {
        console.error("Error loading intake data:", error);
        setIntakeData({
          procedure: procedure,
          travel_date: "2024-03-15",
          country: "Vietnam",
        });
      } finally {
        setLoading(false);
      }
    };

    loadIntakeData();
  }, [conversationId, procedure]);

  const procedureKey = intakeData?.procedure?.toLowerCase().replace(/\s+/g, "-") || procedure;
  const vietnamCosts = PROCEDURE_COSTS[procedureKey] || PROCEDURE_COSTS.other;
  const usCosts = US_COSTS[procedureKey] || US_COSTS.other;

  // Calculate savings
  const avgVietnam = (vietnamCosts.low + vietnamCosts.high) / 2;
  const avgUS = (usCosts.low + usCosts.high) / 2;
  const savings = Math.round(((avgUS - avgVietnam) / avgUS) * 100);

  // Calculate total estimates
  const hotelCost = { low: 400, high: 800 };
  const flightCost = { low: 800, high: 1500 };
  const otherCosts = { low: 380, high: 900 }; // tests, meds, transport, insurance

  const totalLow = vietnamCosts.low + hotelCost.low + flightCost.low + otherCosts.low;
  const totalHigh = vietnamCosts.high + hotelCost.high + flightCost.high + otherCosts.high;
  const midEstimate = Math.round((totalLow + totalHigh) / 2);

  const handleDownloadPDF = () => {
    toast({
      title: "Coming Soon",
      description: "PDF download will be available soon.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  const procedureDisplay = procedureKey.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer" 
              onClick={() => navigate("/")}
            >
              MedVoy AI
            </h1>
            <Badge variant="outline">Cost Estimate</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Trip Cost Estimate</h2>
          <p className="text-muted-foreground">
            Detailed breakdown for {procedureDisplay} in Vietnam
          </p>
        </div>

        {/* Savings Banner */}
        <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <TrendingDown className="h-6 w-6 text-green-600" />
              <p className="text-lg">
                Save up to <strong className="text-green-600 text-xl">{savings}%</strong> compared to US prices
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                US Average: ${avgUS.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Low Estimate</p>
              <p className="text-2xl font-bold text-green-600">${totalLow.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Best Estimate</p>
              <p className="text-2xl font-bold text-primary">${midEstimate.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">High Estimate</p>
              <p className="text-2xl font-bold text-amber-600">${totalHigh.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Trip Duration</p>
              <p className="text-2xl font-bold">10-14 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cost Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <CostBreakdownCard
              procedure={procedureDisplay}
              procedureCostLow={vietnamCosts.low}
              procedureCostHigh={vietnamCosts.high}
              hotelCostLow={hotelCost.low}
              hotelCostHigh={hotelCost.high}
              flightCostLow={flightCost.low}
              flightCostHigh={flightCost.high}
            />

            {/* Trip Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Recommended Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival</span>
                    <span>2 days before procedure</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Procedure</span>
                    <span>Day 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recovery</span>
                    <span>5-7 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Follow-up</span>
                    <span>Day 10</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Stay</span>
                    <span>10-14 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destination Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Country</span>
                    <span>Vietnam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Top Cities</span>
                    <span>Ho Chi Minh, Hanoi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight Time</span>
                    <span>~16-20 hrs (US)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Zone</span>
                    <span>GMT+7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa</span>
                    <span>E-visa ($25)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CostBreakdownChart
              procedureCost={Math.round((vietnamCosts.low + vietnamCosts.high) / 2)}
              hotelCost={Math.round((hotelCost.low + hotelCost.high) / 2)}
              flightCost={Math.round((flightCost.low + flightCost.high) / 2)}
              otherCosts={Math.round((otherCosts.low + otherCosts.high) / 2)}
            />

            <PaymentTimeline totalCost={midEstimate} />

            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Ready to Book?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request quotes from verified clinics and start planning your trip.
                </p>
                <Button className="w-full" onClick={() => navigate("/explore")}>
                  Find Clinics
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/chat")}
                >
                  Chat with AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostEstimation;
