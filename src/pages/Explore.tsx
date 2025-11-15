import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Award, MessageSquare } from "lucide-react";
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
      // Call AI to generate hospital suggestions with Freepik images
      const { data, error } = await supabase.functions.invoke("generate-hospital-options", {
        body: { procedure, country, priceRange },
      });

      if (error) throw error;

      if (data?.hospitals) {
        setHospitals(data.hospitals);
      }
    } catch (error: any) {
      console.error("Error loading hospitals:", error);
      // Load demo data as fallback
      setHospitals(getDemoHospitals());
    } finally {
      setLoading(false);
    }
  };

  const getDemoHospitals = (): Hospital[] => [
    {
      id: "1",
      name: "Bangkok International Hospital",
      location: "Bangkok, Thailand",
      country: "Thailand",
      priceRange: "mid-range",
      rating: 4.7,
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      accreditation: "JCI Accredited",
    },
    {
      id: "2",
      name: "Bumrungrad International",
      location: "Bangkok, Thailand",
      country: "Thailand",
      priceRange: "premium",
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
      accreditation: "JCI Accredited",
    },
    {
      id: "3",
      name: "Hospital Angeles Tijuana",
      location: "Tijuana, Mexico",
      country: "Mexico",
      priceRange: "budget",
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800",
      accreditation: "JCI Accredited",
    },
    {
      id: "4",
      name: "Medica Sur",
      location: "Mexico City, Mexico",
      country: "Mexico",
      priceRange: "mid-range",
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800",
      accreditation: "JCI Accredited",
    },
    {
      id: "5",
      name: "Memorial Ankara Hospital",
      location: "Ankara, Turkey",
      country: "Turkey",
      priceRange: "budget",
      rating: 4.4,
      imageUrl: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800",
      accreditation: "JCI Accredited",
    },
    {
      id: "6",
      name: "Acibadem Maslak Hospital",
      location: "Istanbul, Turkey",
      country: "Turkey",
      priceRange: "mid-range",
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800",
      accreditation: "JCI Accredited",
    },
  ];

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
      title: "Redirecting to AI Concierge",
      description: `Getting estimate for ${hospital.name}`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
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
      <div className="max-w-7xl mx-auto px-6 -mt-8">
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
                  <Button className="w-full" onClick={() => handleGetEstimate(hospital)}>
                    Get Cost Estimate
                  </Button>
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
