import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Award, X, DollarSign, Stethoscope, Building } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  location: string;
  country: string;
  priceRange: "budget" | "mid-range" | "premium";
  rating: number;
  imageUrl: string;
  accreditation: string;
  specialties?: string[];
  procedures?: string[];
  estimatedCostLow?: number;
  estimatedCostHigh?: number;
}

interface HospitalComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitals: Hospital[];
  onRemoveHospital: (hospitalId: string) => void;
}

const HospitalComparisonDialog = ({ 
  open, 
  onOpenChange, 
  hospitals,
  onRemoveHospital 
}: HospitalComparisonDialogProps) => {
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

  const formatCost = (low?: number, high?: number) => {
    if (!low || !high) return "Contact for pricing";
    return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hospital Comparison</DialogTitle>
          <DialogDescription>
            Compare up to 4 hospitals side-by-side to find the best match for your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="border rounded-lg p-4 relative bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onRemoveHospital(hospital.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="relative h-32 mb-3 rounded-md overflow-hidden">
                <img
                  src={hospital.imageUrl}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-bold text-sm mb-2 pr-6">{hospital.name}</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">{hospital.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs">{hospital.accreditation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="font-medium">{hospital.rating} / 5.0</span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Badge className={`${getPriceRangeBadgeColor(hospital.priceRange)} text-white capitalize text-xs`}>
                    {hospital.priceRange}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-xs">Specialties</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties?.slice(0, 3).map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {hospital.specialties && hospital.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hospital.specialties.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-xs">Procedures</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hospital.procedures?.slice(0, 3).map((procedure, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {procedure}
                      </Badge>
                    ))}
                    {hospital.procedures && hospital.procedures.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{hospital.procedures.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold mb-1">Estimated Cost Range</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCost(hospital.estimatedCostLow, hospital.estimatedCostHigh)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HospitalComparisonDialog;