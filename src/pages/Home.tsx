import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, Shield, Award, Globe, DollarSign, Calendar, Plane, ChevronDown } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Discover Accredited Hospitals",
      description: "Browse JCI-accredited medical facilities worldwide with verified credentials and quality standards.",
    },
    {
      icon: DollarSign,
      title: "Transparent Price Estimates",
      description: "Get realistic total cost breakdowns including procedure, flights, accommodation, and all fees.",
    },
    {
      icon: MessageSquare,
      title: "Personalized AI Concierge",
      description: "Chat 24/7 with our intelligent assistant that guides you through every decision.",
    },
    {
      icon: Calendar,
      title: "Schedule Consultations",
      description: "We handle scheduling consultations and obtaining quotes from hospitals on your behalf.",
    },
    {
      icon: Plane,
      title: "Full Booking Support",
      description: "Complete travel coordination including flights, hotels, transfers, and tour guides.",
    },
    {
      icon: Shield,
      title: "Safe, Accredited Partners",
      description: "100% JCI-accredited hospitals ensuring international healthcare quality standards.",
    },
  ];

  const trustBadges = [
    { label: "JCI Accredited", icon: Shield },
    { label: "ISQua Verified", icon: Award },
    { label: "50+ Countries", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            MedVoy AI
          </h1>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" onClick={() => navigate("/explore")}>
              Explore
            </Button>
            <Button variant="ghost" onClick={() => navigate("/chat")}>
              Chat
            </Button>
            <div className="relative group">
              <Button variant="ghost">
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
              <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/resources")}>
                  Resource Hub
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/support")}>
                  Support / FAQ
                </Button>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate("/how-it-works")}>
              How It Works
            </Button>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6" variant="outline">AI-Powered Medical Tourism</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            Your Complete Medical Travel Journey, Planned by AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From discovery to recovery, MedVoy AI creates, communicates, and executes your entire medical tourism plan with safe, accredited hospitals worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/chat")}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Planning
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/explore")}>
              <Search className="mr-2 h-5 w-5" />
              Explore Hospitals
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{badge.label}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2">
              <span className="font-semibold">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Verified Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* What MedVoy Does Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What MedVoy Does</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your AI-powered medical tourism concierge, handling everything from hospital matching to travel coordination
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Simple, Transparent Process</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Six simple steps from consultation to recovery, all managed by our AI concierge
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-12">
            {["Tell Us Your Needs", "Explore Options", "Get Estimates", "Choose Hospital", "We Schedule", "Book & Travel"].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium">{step}</p>
              </div>
            ))}
          </div>
          <Button size="lg" variant="outline" onClick={() => navigate("/how-it-works")}>
            See Full Process
          </Button>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Your Safety is Our Priority</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-muted-foreground">JCI-Accredited Partners</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Countries Worldwide</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-muted-foreground">AI Support</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Every hospital is thoroughly vetted for quality, credentials, and international standards. 
                No hidden fees. Complete transparency. Your peace of mind guaranteed.
              </p>
              <Button size="lg" onClick={() => navigate("/about")}>
                Learn About Our Standards
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Medical Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get personalized recommendations and transparent cost estimates in minutes
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/chat")}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI Concierge
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/explore")}>
              <Search className="mr-2 h-5 w-5" />
              Browse Hospitals
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">MedVoy AI</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered medical tourism planning from discovery to recovery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="flex flex-col gap-2">
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/explore")}>
                  Explore Hospitals
                </Button>
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/chat")}>
                  AI Chat
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="flex flex-col gap-2">
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/about")}>
                  About Us
                </Button>
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/how-it-works")}>
                  How It Works
                </Button>
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/support")}>
                  Support
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="flex flex-col gap-2">
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/resources")}>
                  Resource Hub
                </Button>
                <Button variant="link" className="justify-start p-0 h-auto" onClick={() => navigate("/support")}>
                  FAQ
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 MedVoy AI. All rights reserved. Your safety and privacy are our priority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
