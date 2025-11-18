import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calculator, Home, Search, BookOpen } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Tell Us Your Medical Needs",
      description: "Share your procedure requirements, budget, and preferences with our AI concierge.",
      icon: MessageSquare,
    },
    {
      number: "2",
      title: "Explore Accredited Hospitals",
      description: "Browse JCI-accredited hospitals worldwide with transparent pricing and verified credentials.",
      icon: Search,
    },
    {
      number: "3",
      title: "Receive Transparent Cost Estimates",
      description: "Get detailed breakdowns including procedure, flights, accommodation, and all associated costs.",
      icon: Calculator,
    },
    {
      number: "4",
      title: "Choose a Listing",
      description: "Select the hospital and package that best fits your needs and budget.",
      icon: BookOpen,
    },
    {
      number: "5",
      title: "MedVoy Schedules Consultation",
      description: "We handle scheduling consultations and obtaining official quotes on your behalf.",
      icon: MessageSquare,
    },
    {
      number: "6",
      title: "Book Your Medical Journey",
      description: "We coordinate flights, hotels, transfers, and optional tour guides for a seamless experience.",
      icon: Home,
    },
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
            <Button variant="ghost" onClick={() => navigate("/cost-breakdown")}>
              <Calculator className="mr-2 h-4 w-4" />
              Cost Estimate
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">How MedVoy Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your complete journey from discovery to recovery, guided by AI and executed with care
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid gap-8 md:gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl font-bold text-primary/5 -mt-4 -mr-4">
                  {step.number}
                </div>
                <div className="flex items-start gap-6 relative z-10">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-semibold text-primary">STEP {step.number}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Medical Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our AI concierge guide you through safe, affordable medical care worldwide
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/")}>
              Start Chatting
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

export default HowItWorks;
