import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Search, 
  FileText, 
  Download, 
  CheckCircle, 
  Globe, 
  Plane, 
  Shield, 
  DollarSign,
  Clock,
  MapPin,
  AlertCircle,
  Stethoscope
} from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does MedVoy AI ensure hospital quality and safety?",
      answer: "We exclusively partner with JCI-accredited hospitals that meet rigorous international healthcare standards. Each facility undergoes thorough vetting for quality, credentials, and patient safety protocols. JCI accreditation ensures that hospitals meet over 1,300 standards across patient care, safety, and quality management."
    },
    {
      question: "Are the cost estimates accurate?",
      answer: "Our AI generates realistic estimates based on current market data, including procedure costs, flights, accommodation, and associated expenses. Final costs are confirmed when we obtain official quotes from hospitals on your behalf. We analyze thousands of data points to provide the most accurate estimates possible."
    },
    {
      question: "What's included in the total cost?",
      answer: "Total costs typically include: the medical procedure, hospital stay, surgeon and anesthesiologist fees, pre-operative tests, post-operative care, medications, round-trip flights, accommodation, ground transportation, and medical translation services. We provide a detailed breakdown for transparency."
    },
    {
      question: "How long does the medical tourism process take?",
      answer: "Timeline varies by procedure: Initial research and hospital selection (1-3 days), consultation scheduling (3-7 days), medical evaluation and clearance (1-2 weeks), and travel arrangements (2-4 weeks before procedure). Total planning time is typically 4-8 weeks."
    },
    {
      question: "What countries do you cover?",
      answer: "We partner with JCI-accredited hospitals in 50+ countries including Thailand, Mexico, India, Turkey, South Korea, Singapore, UAE, Costa Rica, Colombia, and Spain. Each destination offers different specialties and price advantages."
    },
    {
      question: "Do I need travel insurance?",
      answer: "Yes, we strongly recommend comprehensive travel insurance that covers medical complications, trip cancellations, and emergency evacuation. Standard travel insurance may not cover elective procedures, so specialized medical tourism insurance is advisable."
    },
    {
      question: "What if complications arise after I return home?",
      answer: "We coordinate follow-up care with your local healthcare provider. Many hospitals offer telemedicine consultations post-procedure. We also provide detailed medical records and ensure continuity of care. Emergency support is available 24/7."
    },
    {
      question: "How do I communicate with doctors abroad?",
      answer: "Most international hospitals have English-speaking staff and medical coordinators. We also provide professional medical translation services when needed. Virtual consultations before travel help establish communication and build trust with your medical team."
    }
  ];

  const destinations = [
    {
      country: "Thailand",
      specialties: ["Cosmetic Surgery", "Dental Care", "Orthopedics", "Cardiac Care"],
      avgSavings: "50-70%",
      hospitals: "40+ JCI Accredited",
      badge: "Most Popular"
    },
    {
      country: "Mexico",
      specialties: ["Dental Implants", "Bariatric Surgery", "Cosmetic Procedures"],
      avgSavings: "40-65%",
      hospitals: "30+ JCI Accredited",
      badge: "Close to US"
    },
    {
      country: "India",
      specialties: ["Cardiac Surgery", "Orthopedics", "Oncology", "IVF"],
      avgSavings: "65-90%",
      hospitals: "35+ JCI Accredited",
      badge: "Best Value"
    },
    {
      country: "Turkey",
      specialties: ["Hair Transplant", "Eye Surgery", "Cosmetic Dentistry"],
      avgSavings: "50-75%",
      hospitals: "45+ JCI Accredited",
      badge: "Rising Star"
    },
    {
      country: "South Korea",
      specialties: ["Cosmetic Surgery", "Advanced Dermatology", "Stem Cell Therapy"],
      avgSavings: "30-50%",
      hospitals: "20+ JCI Accredited",
      badge: "Innovation Hub"
    },
    {
      country: "Singapore",
      specialties: ["Cancer Treatment", "Neurosurgery", "Robotic Surgery"],
      avgSavings: "25-40%",
      hospitals: "15+ JCI Accredited",
      badge: "Premium Quality"
    }
  ];

  const travelChecklist = [
    {
      phase: "Before Booking (4-8 weeks before)",
      items: [
        "Research procedures and destinations",
        "Consult with your local doctor",
        "Get medical clearance and records",
        "Review hospital accreditations",
        "Compare cost estimates",
        "Check passport validity (6+ months)",
        "Research visa requirements"
      ]
    },
    {
      phase: "After Booking (2-4 weeks before)",
      items: [
        "Book flights and accommodation",
        "Purchase travel insurance",
        "Schedule virtual consultation",
        "Arrange time off work",
        "Prepare medical history documents",
        "Research local area and recovery facilities",
        "Notify your bank of travel plans"
      ]
    },
    {
      phase: "Packing Essentials",
      items: [
        "Passport and visa documents",
        "Medical records and test results",
        "List of current medications",
        "Travel insurance documents",
        "Loose, comfortable clothing",
        "Prescription medications (clearly labeled)",
        "Emergency contact information"
      ]
    },
    {
      phase: "During Stay",
      items: [
        "Attend all scheduled appointments",
        "Follow pre-operative instructions",
        "Ask questions and clarify doubts",
        "Keep all medical receipts",
        "Get detailed discharge instructions",
        "Obtain medical records and reports",
        "Schedule follow-up consultations"
      ]
    },
    {
      phase: "After Returning Home",
      items: [
        "Share records with local doctor",
        "Attend follow-up appointments",
        "Monitor recovery progress",
        "Report any complications immediately",
        "Keep telemedicine access open",
        "Maintain recommended lifestyle changes",
        "Keep records organized for insurance"
      ]
    }
  ];

  const procedures = [
    {
      category: "Cosmetic Surgery",
      items: ["Rhinoplasty", "Facelift", "Liposuction", "Breast Augmentation", "Tummy Tuck"],
      avgCost: "$3,000 - $8,000",
      duration: "7-14 days"
    },
    {
      category: "Dental Procedures",
      items: ["Dental Implants", "Veneers", "Full Mouth Reconstruction", "Root Canal", "Crowns"],
      avgCost: "$1,500 - $5,000",
      duration: "5-10 days"
    },
    {
      category: "Orthopedic Surgery",
      items: ["Knee Replacement", "Hip Replacement", "Spinal Surgery", "Shoulder Surgery"],
      avgCost: "$6,000 - $12,000",
      duration: "10-21 days"
    },
    {
      category: "Cardiac Procedures",
      items: ["Heart Bypass Surgery", "Valve Replacement", "Angioplasty", "Pacemaker"],
      avgCost: "$8,000 - $20,000",
      duration: "14-21 days"
    },
    {
      category: "Bariatric Surgery",
      items: ["Gastric Sleeve", "Gastric Bypass", "Lap Band", "Gastric Balloon"],
      avgCost: "$5,000 - $10,000",
      duration: "7-14 days"
    },
    {
      category: "Eye Surgery",
      items: ["LASIK", "Cataract Surgery", "Retinal Surgery", "Corneal Transplant"],
      avgCost: "$1,000 - $4,000",
      duration: "3-7 days"
    }
  ];

  const guides = [
    {
      title: "Complete Medical Tourism Handbook",
      description: "Comprehensive 50-page guide covering everything from hospital selection to recovery",
      size: "2.5 MB PDF",
      icon: FileText
    },
    {
      title: "Pre-Travel Medical Checklist",
      description: "Essential checklist to ensure you're fully prepared before departure",
      size: "500 KB PDF",
      icon: CheckCircle
    },
    {
      title: "Country-Specific Visa Guide",
      description: "Detailed visa requirements and application processes for medical tourism",
      size: "1.8 MB PDF",
      icon: Globe
    },
    {
      title: "Post-Surgery Recovery Guide",
      description: "Expert tips for optimal recovery and managing post-operative care",
      size: "1.2 MB PDF",
      icon: Stethoscope
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="outline">Comprehensive Medical Tourism Resources</Badge>
          <h1 className="text-5xl font-bold mb-4">Medical Travel Resource Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert guides, destination information, travel checklists, and FAQs to help you make informed decisions about your medical tourism journey
          </p>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-12 container mx-auto px-4">
        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="guides">Guides & Tips</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="checklist">Travel Checklist</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>

          {/* Guides & Tips */}
          <TabsContent value="guides" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Downloadable Guides</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="mb-2">{guide.title}</CardTitle>
                            <CardDescription>{guide.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{guide.size}</span>
                          <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Essential Tips for Medical Tourists</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Safety First
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Always verify JCI or ISO accreditation before booking</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Research surgeon credentials and experience thoroughly</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Get comprehensive travel and medical insurance</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Keep emergency contacts and embassy info accessible</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Budget Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Add 15-20% buffer for unexpected expenses</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Factor in pre and post-operative care costs</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Include extended stay costs for recovery period</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Consider currency exchange rates and fees</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Timing Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Plan for minimum 2-3 week total travel time</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Consider weather and peak tourism seasons</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Book flights with flexible change policies</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Allow adequate recovery time before flying home</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="w-5 h-5 text-primary" />
                      Travel Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Arrange airport pickup and local transportation</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Stay near hospital for post-op appointments</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Bring translated medical documents</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Pack medical supplies and compression garments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Destinations */}
          <TabsContent value="destinations">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Top Medical Tourism Destinations</h2>
              <p className="text-muted-foreground">
                Compare popular destinations, their specialties, and average cost savings
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl">{dest.country}</CardTitle>
                      <Badge>{dest.badge}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {dest.hospitals}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        Avg Savings: {dest.avgSavings}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Top Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {dest.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-4" onClick={() => navigate("/explore")}>
                      Explore Hospitals
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Procedures */}
          <TabsContent value="procedures">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Popular Medical Procedures</h2>
              <p className="text-muted-foreground">
                Overview of common procedures, typical costs, and required stay duration
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {procedures.map((proc, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{proc.category}</CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {proc.avgCost}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {proc.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {proc.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/chat")}>
                      Get Cost Estimate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Travel Checklist */}
          <TabsContent value="checklist">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Complete Travel Checklist</h2>
              <p className="text-muted-foreground">
                Step-by-step checklist to ensure you're fully prepared for your medical journey
              </p>
            </div>
            <div className="space-y-6">
              {travelChecklist.map((phase, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      {phase.phase}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {phase.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-2">Pro Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Print this checklist and keep physical copies of all important documents. 
                      Digital backups are great, but having physical copies can be crucial if you 
                      encounter technology issues while traveling.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs */}
          <TabsContent value="faq">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Get answers to common questions about medical tourism and our services
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Still have questions?</CardTitle>
                <CardDescription>
                  Our team is here to help you with any concerns about your medical tourism journey
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => navigate("/chat")}>
                  Chat with AI Concierge
                </Button>
                <Button variant="outline" onClick={() => navigate("/support")}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Medical Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get personalized cost estimates and hospital recommendations from our AI concierge
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/chat")}>
              Start Planning Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/explore")}>
              Explore Hospitals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;