import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calculator, Home, Search, Shield, Award, Globe, Heart } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "We only partner with JCI-accredited hospitals that meet international healthcare standards.",
    },
    {
      icon: Award,
      title: "Verified Excellence",
      description: "Every hospital and healthcare provider is thoroughly vetted for quality and credentials.",
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Access top-tier medical care across multiple countries and specialties worldwide.",
    },
    {
      icon: Heart,
      title: "Patient-Centered",
      description: "Your health, comfort, and peace of mind are our top priorities throughout your journey.",
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
          <h1 className="text-5xl font-bold mb-6">About MedVoy AI</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming medical tourism through AI-powered planning and execution
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              MedVoy AI creates, communicates, and executes complete medical tourism plans on behalf of our customers. 
              We bridge the gap between patients seeking quality healthcare and accredited hospitals worldwide, 
              providing transparent pricing, personalized guidance, and comprehensive booking support from discovery to recovery.
            </p>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Hospital Matching</h3>
              <p className="text-muted-foreground">
                Connect with safe, JCI-accredited hospitals worldwide that match your specific medical needs and budget.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Cost Transparency</h3>
              <p className="text-muted-foreground">
                Get realistic total cost estimates including procedure, flights, accommodation, and all associated expenses.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">AI Concierge</h3>
              <p className="text-muted-foreground">
                Chat with our intelligent assistant that guides you through options and answers your questions 24/7.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Consultation Scheduling</h3>
              <p className="text-muted-foreground">
                We schedule consultations and obtain quotes from hospitals on your behalf, saving you time and effort.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">Travel Coordination</h3>
              <p className="text-muted-foreground">
                Complete booking support for flights, hotels, transfers, and optional tour guides for a seamless experience.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-3">End-to-End Support</h3>
              <p className="text-muted-foreground">
                From initial discovery through recovery, we're with you every step of your medical journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Trusted Medical Tourism Partner</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">JCI Accredited Partners</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            No hidden fees. Verified partners. Transparent pricing. Your safety is our priority.
          </p>
          <Button size="lg" onClick={() => navigate("/")}>
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
