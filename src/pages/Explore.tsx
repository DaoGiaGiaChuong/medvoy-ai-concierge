import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Award, MessageSquare, Calculator, Home, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  location: string;
  country: string;
  priceRange: "budget" | "mid-range" | "premium";
  rating: number;
  imageUrl: string;
  accreditation: string;
}

const Explore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [procedure, setProcedure] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  useEffect(() => {
    loadHospitals();
  }, [procedure, country, priceRange]);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      // Fetch real JCI-accredited hospitals from database
      const { data, error } = await supabase.functions.invoke("fetch-hospitals", {
        body: { 
          procedure: procedure !== "all" ? procedure : undefined, 
          country: country !== "all" ? country : undefined, 
          priceRange: priceRange !== "all" ? priceRange : undefined 
        },
      });

      if (error) throw error;

      if (data?.hospitals && data.hospitals.length > 0) {
        setHospitals(data.hospitals.map((h: any) => ({
          id: h.id,
          name: h.name,
          location: h.location,
          country: h.country,
          priceRange: h.price_range,
          rating: h.rating,
          imageUrl: h.image_url,
          accreditation: h.accreditation_info || "JCI Accredited",
        })));
      } else {
        // No hospitals found with current filters
        setHospitals([]);
        toast({
          title: "No hospitals found",
          description: "Try adjusting your filters to see more options.",
        });
      }
    } catch (error: any) {
      console.error("Error loading hospitals:", error);
      toast({
        title: "Error loading hospitals",
        description: "Please try again later.",
        variant: "destructive",
      });
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };


  const getPriceRangeBadgeColor = (range: string) => {
    switch (range) {
      case "budget":
        return "bg-green-500";
      case "mid-range":
        return "bg-blue-500";
      case "premium":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleGetEstimate = (hospital: Hospital) => {
    toast({
      title: "Generating Estimate",
      description: `Creating cost estimate for ${hospital.name}...`,
    });
    setTimeout(() => {
      navigate("/cost-breakdown", {
        state: {
          hospital: hospital.name,
          country: hospital.location,
          procedure: procedure === "all" ? "Medical Procedure" : procedure
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
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

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Your Global Healthcare Journey Starts Here</h1>
          <p className="text-xl mb-8 opacity-90">
            Compare world-class hospitals, estimate costs, and connect with JCI-accredited facilities across the globe.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
            >
              Explore Hospitals
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Talk to AI Concierge
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect Match</h2>
            <p className="text-muted-foreground mb-6">
              Filter by procedure, location, and budget to discover the best options
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Procedure</label>
                <Select value={procedure} onValueChange={setProcedure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All procedures</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic Surgery</SelectItem>
                    <SelectItem value="dental">Dental Care</SelectItem>
                    <SelectItem value="orthopedic">Orthopedic</SelectItem>
                    <SelectItem value="cardiac">Cardiac Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All countries</SelectItem>
                    <SelectItem value="thailand">Thailand</SelectItem>
                    <SelectItem value="mexico">Mexico</SelectItem>
                    <SelectItem value="turkey">Turkey</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All price ranges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All price ranges</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="mid-range">Mid-Range</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Available Hospitals ({hospitals.length})</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${getPriceRangeBadgeColor(hospital.priceRange)} text-white capitalize`}
                  >
                    {hospital.priceRange}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{hospital.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hospital.location}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{hospital.accreditation}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hospital.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/hospital/${hospital.id}`)}
                    >
                      View Details
                    </Button>
                    <Button className="flex-1" onClick={() => handleGetEstimate(hospital)}>
                      Get Estimate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
