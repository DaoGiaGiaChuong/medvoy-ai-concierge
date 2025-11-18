import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calculator, Home, Search, Mail, Phone, HelpCircle } from "lucide-react";

const Support = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does MedVoy AI ensure hospital quality and safety?",
      answer: "We exclusively partner with JCI-accredited hospitals that meet rigorous international healthcare standards. Each facility undergoes thorough vetting for quality, credentials, and patient safety protocols.",
    },
    {
      question: "Are the cost estimates accurate?",
      answer: "Our AI generates realistic estimates based on current market data, including procedure costs, flights, accommodation, and associated expenses. Final costs are confirmed when we obtain official quotes from hospitals on your behalf.",
    },
    {
      question: "When do I need to sign in?",
      answer: "You can explore hospitals and get cost estimates without signing in. Sign-in is required only when you want to save treatment plans, request hospital quotes, schedule consultations, upload medical records, or make payments for concierge upgrades.",
    },
    {
      question: "What's included in your service?",
      answer: "We provide hospital matching, transparent cost estimates, AI concierge guidance, consultation scheduling, quote procurement, and complete travel coordination including flights, hotels, transfers, and optional tour guides.",
    },
    {
      question: "How long does the process take?",
      answer: "The timeline varies by procedure and destination. Typically, initial research and hospital selection takes 1-3 days, consultation scheduling 3-7 days, and travel arrangements can be made 2-4 weeks before your procedure date.",
    },
    {
      question: "What countries do you cover?",
      answer: "We have partnerships with JCI-accredited hospitals in over 50 countries worldwide, including popular medical tourism destinations like Thailand, Mexico, India, Turkey, South Korea, and many more.",
    },
    {
      question: "Are there any hidden fees?",
      answer: "No. We believe in complete transparency. All costs are clearly outlined in our estimates, and we disclose our service fees upfront. You'll know exactly what to expect before making any commitments.",
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer: "Cancellation and rescheduling policies vary by hospital and service provider. We'll clearly communicate these policies before booking and assist you with any changes needed to your travel plans.",
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
          <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">How Can We Help?</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Still Have Questions?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Chat with AI</h3>
              <p className="text-muted-foreground mb-4">
                Get instant answers from our AI concierge 24/7
              </p>
              <Button onClick={() => navigate("/")}>Start Chatting</Button>
            </Card>
            <Card className="p-6 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Email Support</h3>
              <p className="text-muted-foreground mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <Button variant="outline">support@medvoy.ai</Button>
            </Card>
            <Card className="p-6 text-center">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Phone Support</h3>
              <p className="text-muted-foreground mb-4">
                Speak with our team during business hours
              </p>
              <Button variant="outline">+1 (555) 123-4567</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 container mx-auto px-4">
        <Card className="p-8 max-w-2xl mx-auto bg-destructive/5 border-destructive/20">
          <h3 className="text-xl font-bold mb-3 text-center">Medical Emergency?</h3>
          <p className="text-muted-foreground text-center mb-4">
            If you're experiencing a medical emergency during your travel, contact local emergency services immediately. 
            Then reach out to our 24/7 emergency support line.
          </p>
          <div className="text-center">
            <Button variant="destructive" size="lg">
              Emergency Hotline: +1 (555) 911-HELP
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Support;
