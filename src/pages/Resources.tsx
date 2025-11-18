import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calculator, Home, Search, BookOpen, FileText, Newspaper } from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();

  const articles = [
    {
      category: "Cost Guides",
      title: "Complete Cost Breakdown: Knee Replacement Surgery Abroad",
      excerpt: "Everything you need to know about pricing, including hidden costs and country comparisons.",
      readTime: "8 min read",
    },
    {
      category: "Travel Planning",
      title: "Visa Requirements for Medical Tourism by Country",
      excerpt: "Navigate visa applications and medical tourism documentation with ease.",
      readTime: "6 min read",
    },
    {
      category: "Safety & Quality",
      title: "Understanding JCI Accreditation: What It Means for You",
      excerpt: "Learn why JCI accreditation matters and how it ensures international quality standards.",
      readTime: "5 min read",
    },
    {
      category: "Country Guides",
      title: "Thailand Medical Tourism: Complete 2024 Guide",
      excerpt: "Discover why Thailand is a leading destination for medical procedures and what to expect.",
      readTime: "10 min read",
    },
    {
      category: "Procedures",
      title: "Dental Implants Abroad: Quality vs Cost Analysis",
      excerpt: "Compare costs and quality of dental implant procedures across different countries.",
      readTime: "7 min read",
    },
    {
      category: "Recovery",
      title: "Post-Surgery Recovery: Planning Your Medical Travel Stay",
      excerpt: "Essential tips for planning recovery time, accommodation, and follow-up care abroad.",
      readTime: "9 min read",
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
          <h1 className="text-5xl font-bold mb-6">Medical Travel Resource Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert guides, cost breakdowns, and essential information for your medical tourism journey
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button variant="outline">All Articles</Button>
          <Button variant="ghost">Cost Guides</Button>
          <Button variant="ghost">Travel Planning</Button>
          <Button variant="ghost">Safety & Quality</Button>
          <Button variant="ghost">Country Guides</Button>
          <Button variant="ghost">Procedures</Button>
          <Button variant="ghost">Recovery</Button>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <FileText className="w-16 h-16 text-primary/40" />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-semibold mb-2">{article.category}</div>
                <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{article.readTime}</span>
                  <Button variant="ghost" size="sm">Read More</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <Newspaper className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the latest medical tourism news, cost updates, and travel guides delivered to your inbox
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
