import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Home, MessageSquare, FileText, LayoutGrid, List, ArrowLeft, RefreshCw, Scale } from "lucide-react";
import QuoteCard, { BookingInquiry } from "@/components/booking/QuoteCard";
import QuoteComparison from "@/components/booking/QuoteComparison";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Sign In Required",
          description: "Please sign in to view your dashboard.",
        });
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadInquiries(session.user.id);
    };

    checkAuth();
  }, [navigate]);

  const loadInquiries = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("booking_inquiries")
        .select(`
          *,
          hospital:hospitals(id, name, location, country, image_url, rating)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform to match expected type
      const transformedData = (data || []).map(item => ({
        ...item,
        hospital: Array.isArray(item.hospital) ? item.hospital[0] : item.hospital
      }));

      setInquiries(transformedData);
    } catch (error: any) {
      console.error("Error loading inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load your requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleComparison = (id: string) => {
    setSelectedForComparison(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const filteredInquiries = inquiries.filter(i => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return i.status === "pending";
    if (activeTab === "responded") return i.status === "responded";
    if (activeTab === "accepted") return i.status === "accepted";
    return true;
  });

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === "pending").length,
    responded: inquiries.filter(i => i.status === "responded").length,
    accepted: inquiries.filter(i => i.status === "accepted").length,
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer" 
              onClick={() => navigate("/")}
            >
              MedVoy AI
            </h1>
            <Badge variant="outline">Dashboard</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/explore")}>
              Explore Clinics
            </Button>
            <Button variant="ghost" onClick={() => navigate("/chat")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Quotes Received</p>
              <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-3xl font-bold text-blue-600">{stats.accepted}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Quote Requests
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => user && loadInquiries(user.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <div className="border rounded-md p-1">
                      <Button 
                        variant={viewMode === "grid" ? "secondary" : "ghost"} 
                        size="icon"
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "secondary" : "ghost"} 
                        size="icon"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="responded">Quoted ({stats.responded})</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab}>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                              <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                              <div className="h-3 bg-muted rounded w-1/2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : filteredInquiries.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start by exploring clinics and requesting quotes.
                        </p>
                        <Button onClick={() => navigate("/explore")}>
                          Explore Clinics
                        </Button>
                      </div>
                    ) : (
                      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                        {filteredInquiries.map((inquiry) => (
                          <QuoteCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            isSelected={selectedForComparison.includes(inquiry.id)}
                            onSelect={() => toggleComparison(inquiry.id)}
                            onViewDetails={() => {}}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Comparison */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Compare Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedForComparison.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Click on quote cards to select them for comparison</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedForComparison.length} quote{selectedForComparison.length !== 1 ? "s" : ""} selected
                    </p>
                    {selectedForComparison.length >= 2 && (
                      <Button 
                        className="w-full"
                        onClick={() => {/* Open comparison modal */}}
                      >
                        View Comparison
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedForComparison([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/intake")}>
                  <FileText className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/explore")}>
                  <Home className="mr-2 h-4 w-4" />
                  Browse Clinics
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/chat")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Comparison (when 2+ selected) */}
        {selectedForComparison.length >= 2 && (
          <div className="mt-8">
            <QuoteComparison
              inquiries={inquiries}
              selectedIds={selectedForComparison}
              onToggleSelect={toggleComparison}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
