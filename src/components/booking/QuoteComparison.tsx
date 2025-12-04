import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { MapPin, Star, Award, Check, X, HelpCircle } from "lucide-react";
import type { BookingInquiry } from "./QuoteCard";

interface QuoteComparisonProps {
  inquiries: BookingInquiry[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

const QuoteComparison = ({ inquiries, selectedIds, onToggleSelect }: QuoteComparisonProps) => {
  const selectedInquiries = inquiries.filter(i => selectedIds.includes(i.id));

  if (selectedInquiries.length < 2) {
    return (
      <Card className="p-8 text-center">
        <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select Quotes to Compare</h3>
        <p className="text-muted-foreground">
          Select at least 2 quotes from your requests to see a side-by-side comparison.
        </p>
      </Card>
    );
  }

  const features = [
    { key: "location", label: "Location" },
    { key: "status", label: "Quote Status" },
    { key: "rating", label: "Rating" },
    { key: "english", label: "English Speaking" },
    { key: "accreditation", label: "Accreditation" },
  ];

  const getFeatureValue = (inquiry: BookingInquiry, key: string) => {
    switch (key) {
      case "location":
        return inquiry.hospital?.location || "N/A";
      case "status":
        return inquiry.status === "responded" ? "Quote Ready" : inquiry.status === "pending" ? "Pending" : inquiry.status;
      case "rating":
        return inquiry.hospital?.rating ? `${inquiry.hospital.rating}/5` : "N/A";
      case "english":
        return <Check className="h-4 w-4 text-green-500" />;
      case "accreditation":
        return "JCI Accredited";
      default:
        return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comparing {selectedInquiries.length} Quotes</h3>
        <Button variant="outline" size="sm" onClick={() => selectedIds.forEach(id => onToggleSelect(id))}>
          Clear Selection
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-muted/50 font-semibold w-40">Feature</th>
              {selectedInquiries.map((inquiry) => (
                <th key={inquiry.id} className="p-4 bg-muted/50 min-w-[200px]">
                  <div className="text-left">
                    <p className="font-semibold">{inquiry.hospital?.name}</p>
                    <p className="text-sm text-muted-foreground font-normal flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {inquiry.hospital?.country}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={feature.key} className={cn(index % 2 === 0 && "bg-muted/20")}>
                <td className="p-4 font-medium text-muted-foreground">{feature.label}</td>
                {selectedInquiries.map((inquiry) => (
                  <td key={inquiry.id} className="p-4">
                    {getFeatureValue(inquiry, feature.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2">
              <td className="p-4 font-semibold">Action</td>
              {selectedInquiries.map((inquiry) => (
                <td key={inquiry.id} className="p-4">
                  {inquiry.status === "responded" ? (
                    <Button size="sm" className="w-full">Accept This Quote</Button>
                  ) : (
                    <Badge variant="outline">Awaiting Response</Badge>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuoteComparison;
