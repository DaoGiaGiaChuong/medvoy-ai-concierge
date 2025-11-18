import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Plane, 
  Hotel, 
  Calendar, 
  MapPin, 
  Trash2,
  ArrowLeft,
  Calculator
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SavedEstimate = {
  id: string;
  created_at: string;
  estimate_low: number;
  estimate_high: number;
  breakdown: {
    procedure: string;
    destination: string;
    duration: string;
    procedureCost: { low: number; high: number };
    flightCost: { low: number; high: number };
    hotelCost: { low: number; high: number };
    totalCost: { low: number; high: number };
  };
};

const SavedEstimates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchEstimates();
  }, []);

  const checkAuthAndFetchEstimates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your saved estimates.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    fetchEstimates();
  };

  const fetchEstimates = async () => {
    try {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (!conversations || conversations.length === 0) {
        setIsLoading(false);
        return;
      }

      const conversationIds = conversations.map(c => c.id);
      
      const { data, error } = await supabase
        .from("cost_estimates")
        .select("*")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEstimates(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load estimates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("cost_estimates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEstimates(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Success",
        description: "Estimate deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete estimate",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            MedVoy AI
          </h1>
          <Button variant="ghost" onClick={() => navigate("/chat")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Saved Cost Estimates</h1>
          <p className="text-muted-foreground">
            View and manage all your medical tourism cost estimates
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your estimates...</p>
          </div>
        ) : estimates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Saved Estimates Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start a conversation with our AI to get personalized cost estimates
              </p>
              <Button onClick={() => navigate("/chat")}>
                Start Chat
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {estimates.map((estimate) => (
              <Card key={estimate.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {estimate.breakdown.procedure}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {estimate.breakdown.destination}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Estimate?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this cost estimate.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(estimate.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(estimate.created_at), "MMM d, yyyy")}
                    </span>
                    <Badge variant="outline">{estimate.breakdown.duration}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        Procedure
                      </span>
                      <span className="font-medium">
                        {formatCurrency(estimate.breakdown.procedureCost.low)} - {formatCurrency(estimate.breakdown.procedureCost.high)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Plane className="w-4 h-4" />
                        Flights
                      </span>
                      <span className="font-medium">
                        {formatCurrency(estimate.breakdown.flightCost.low)} - {formatCurrency(estimate.breakdown.flightCost.high)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Hotel className="w-4 h-4" />
                        Hotel
                      </span>
                      <span className="font-medium">
                        {formatCurrency(estimate.breakdown.hotelCost.low)} - {formatCurrency(estimate.breakdown.hotelCost.high)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Cost</span>
                      <span className="font-bold text-lg text-primary">
                        {formatCurrency(estimate.breakdown.totalCost.low)} - {formatCurrency(estimate.breakdown.totalCost.high)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/chat")}
                  >
                    Discuss This Estimate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedEstimates;