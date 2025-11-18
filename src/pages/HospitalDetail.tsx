import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MapPin, Star, Award, Phone, Mail, Globe, Calendar, 
  DollarSign, Users, Building2, Stethoscope, ArrowLeft,
  MessageSquare, Calculator, Home, Search, ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  description: string;
  specialties: string[];
  procedures: string[];
  image_url: string;
  jci_accredited: boolean;
  accreditation_info: string;
  price_range: string;
  estimated_cost_low: number;
  estimated_cost_high: number;
  rating: number;
  contact_email: string;
  contact_phone: string;
  website_url: string;
}

interface Review {
  id: string;
  patient_name: string;
  rating: number;
  procedure: string;
  comment: string;
  date: string;
}

const HospitalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock doctors - in production, these would come from database
  const mockDoctors = [
    {
      id: "1",
      name: "Dr. Amit Patel",
      specialty: "Cardiology",
      qualifications: "MD, FACC, 20+ years experience",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      specialty: "Orthopedic Surgery",
      qualifications: "MD, PhD, Board Certified",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
    },
    {
      id: "3",
      name: "Dr. Chen Wei",
      specialty: "Plastic Surgery",
      qualifications: "MD, FACS, 15+ years experience",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400"
    }
  ];

  const [consultForm, setConsultForm] = useState({
    name: "",
    email: "",
    phone: "",
    procedure: "",
    message: "",
    preferred_date: ""
  });

  useEffect(() => {
    loadHospital();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setReviewsLoading(true);
      const { data, error } = await supabase
        .from("patient_reviews")
        .select("*, verified_bookings(procedure_type)")
        .eq("hospital_id", id)
        .eq("review_status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data || []);
      }
      setReviewsLoading(false);
    };

    fetchReviews();
  }, [id]);

  const loadHospital = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setHospital(data);
    } catch (error) {
      console.error("Error loading hospital:", error);
      toast({
        title: "Error",
        description: "Failed to load hospital details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Consultation Request Sent",
      description: "We'll contact you within 24 hours to schedule your consultation.",
    });
    setConsultForm({
      name: "",
      email: "",
      phone: "",
      procedure: "",
      message: "",
      preferred_date: ""
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Hospital not found</p>
          <Button onClick={() => navigate("/explore")}>Back to Explore</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            MedVoy AI
          </h1>
          <div className="hidden md:flex gap-4">
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

      {/* Hero Section with Hospital Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={hospital.image_url}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Button
            variant="outline"
            size="sm"
            className="mb-4 bg-background/80 backdrop-blur"
            onClick={() => navigate("/explore")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {hospital.jci_accredited && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Award className="mr-1 h-3 w-3" />
                    JCI Accredited
                  </Badge>
                )}
                <Badge variant="outline" className="bg-background/80 backdrop-blur capitalize">
                  {hospital.price_range}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{hospital.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {hospital.location}
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hospital.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {hospital.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {hospital.description}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Stethoscope className="mr-2 h-5 w-5 text-primary" />
                          Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {hospital.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Building2 className="mr-2 h-5 w-5 text-primary" />
                          Available Procedures
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {hospital.procedures.map((procedure, index) => (
                            <Badge key={index} variant="outline">
                              {procedure}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Accreditation & Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{hospital.accreditation_info}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Doctors Tab */}
              <TabsContent value="doctors" className="mt-6">
                <div className="grid gap-6">
                  {mockDoctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                            <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                            <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Patient Reviews
                        {reviews.length > 0 && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({reviews.length} reviews)
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {reviewsLoading ? (
                        <p className="text-muted-foreground text-center py-8">Loading reviews...</p>
                      ) : reviews.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No reviews yet. Be the first to share your experience!
                        </p>
                      ) : (
                        reviews.map((review) => (
                          <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold">Anonymous Patient</p>
                                <p className="text-sm text-muted-foreground">
                                  {review.verified_bookings?.procedure_type || "Medical Procedure"} • 
                                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="font-medium">{review.rating}</span>
                                </div>
                                {review.is_verified && (
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.review_text}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {hospital.contact_email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <a href={`mailto:${hospital.contact_email}`} className="text-primary hover:underline">
                          {hospital.contact_email}
                        </a>
                      </div>
                    )}
                    {hospital.contact_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <a href={`tel:${hospital.contact_phone}`} className="text-primary hover:underline">
                          {hospital.contact_phone}
                        </a>
                      </div>
                    )}
                    {hospital.website_url && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <a 
                          href={hospital.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Range Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Estimated Cost Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  ${hospital.estimated_cost_low?.toLocaleString()} - ${hospital.estimated_cost_high?.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Prices vary by procedure. Get a personalized estimate.
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/cost-breakdown", {
                    state: {
                      hospital: hospital.name,
                      country: hospital.location,
                      procedure: "Medical Procedure"
                    }
                  })}
                >
                  Get Detailed Estimate
                </Button>
              </CardContent>
            </Card>

            {/* Consultation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Request Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({...consultForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({...consultForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={consultForm.phone}
                      onChange={(e) => setConsultForm({...consultForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="procedure">Procedure of Interest</Label>
                    <Input
                      id="procedure"
                      value={consultForm.procedure}
                      onChange={(e) => setConsultForm({...consultForm, procedure: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={consultForm.message}
                      onChange={(e) => setConsultForm({...consultForm, message: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Request Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
