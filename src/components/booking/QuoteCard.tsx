import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin, Clock, CheckCircle, XCircle, HelpCircle, MessageSquare } from "lucide-react";

export interface BookingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  hospital_id: string;
  hospital?: {
    id: string;
    name: string;
    location: string;
    country: string;
    image_url: string | null;
    rating: number | null;
  };
}

interface QuoteCardProps {
  inquiry: BookingInquiry;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Response", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: Clock },
  responded: { label: "Quote Received", color: "bg-green-500/10 text-green-600 border-green-500/30", icon: CheckCircle },
  accepted: { label: "Accepted", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: CheckCircle },
  rejected: { label: "Declined", color: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle },
  expired: { label: "Expired", color: "bg-muted text-muted-foreground", icon: HelpCircle },
};

const QuoteCard = ({ inquiry, isSelected, onSelect, onViewDetails }: QuoteCardProps) => {
  const status = statusConfig[inquiry.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card 
      className={cn(
        "transition-all cursor-pointer hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{inquiry.hospital?.name || "Unknown Clinic"}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {inquiry.hospital?.location || "Location unavailable"}
            </div>
          </div>
          <Badge className={cn("border", status.color)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Request Details */}
          <div className="text-sm">
            <p className="text-muted-foreground line-clamp-2">{inquiry.message.split('\n')[0]}</p>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Requested {format(new Date(inquiry.created_at), "MMM d, yyyy")}</span>
            {inquiry.status === "pending" && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Awaiting response
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onViewDetails?.(); }}
            >
              View Details
            </Button>
            {inquiry.status === "responded" && (
              <Button size="sm" className="flex-1">
                Accept Quote
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteCard;
