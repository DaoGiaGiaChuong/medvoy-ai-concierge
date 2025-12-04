import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, Smile, Eye, Heart, Bone, Baby, Syringe, Sparkles, Stethoscope } from "lucide-react";
import { useState } from "react";

interface Procedure {
  id: string;
  name: string;
  icon: React.ElementType;
  averageSavings: string;
  typicalDuration: string;
  category: string;
}

const procedures: Procedure[] = [
  { id: "veneers", name: "Dental Veneers", icon: Smile, averageSavings: "60-70%", typicalDuration: "5-7 days", category: "dental" },
  { id: "rhinoplasty", name: "Rhinoplasty", icon: Sparkles, averageSavings: "50-60%", typicalDuration: "10-14 days", category: "cosmetic" },
  { id: "breast_augmentation", name: "Breast Augmentation", icon: Heart, averageSavings: "50-60%", typicalDuration: "10-14 days", category: "cosmetic" },
  { id: "lasik", name: "LASIK Eye Surgery", icon: Eye, averageSavings: "60-70%", typicalDuration: "3-5 days", category: "eye" },
  { id: "liposuction", name: "Liposuction", icon: Sparkles, averageSavings: "50-60%", typicalDuration: "10-14 days", category: "cosmetic" },
  { id: "ivf", name: "IVF Treatment", icon: Baby, averageSavings: "60-70%", typicalDuration: "14-21 days", category: "fertility" },
  { id: "dental_implants", name: "Dental Implants", icon: Smile, averageSavings: "60-70%", typicalDuration: "7-10 days", category: "dental" },
  { id: "hip_replacement", name: "Hip Replacement", icon: Bone, averageSavings: "50-60%", typicalDuration: "14-21 days", category: "orthopedic" },
  { id: "knee_replacement", name: "Knee Replacement", icon: Bone, averageSavings: "50-60%", typicalDuration: "14-21 days", category: "orthopedic" },
  { id: "facelift", name: "Facelift", icon: Sparkles, averageSavings: "50-60%", typicalDuration: "10-14 days", category: "cosmetic" },
  { id: "tummy_tuck", name: "Tummy Tuck", icon: Sparkles, averageSavings: "50-60%", typicalDuration: "14-21 days", category: "cosmetic" },
  { id: "double_eyelid", name: "Double Eyelid Surgery", icon: Eye, averageSavings: "60-70%", typicalDuration: "5-7 days", category: "cosmetic" },
];

interface ProcedureStepProps {
  selectedProcedure: string;
  onSelect: (procedure: string) => void;
}

const ProcedureStep = ({ selectedProcedure, onSelect }: ProcedureStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customProcedure, setCustomProcedure] = useState("");

  const filteredProcedures = procedures.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomProcedure = () => {
    if (customProcedure.trim()) {
      onSelect(customProcedure.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What procedure are you interested in?</h2>
        <p className="text-muted-foreground">Select from our most popular procedures or search for something specific</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search procedures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Procedure Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProcedures.map((procedure) => {
          const Icon = procedure.icon;
          const isSelected = selectedProcedure === procedure.id;
          
          return (
            <Card
              key={procedure.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50",
                isSelected && "border-primary bg-primary/5 ring-2 ring-primary"
              )}
              onClick={() => onSelect(procedure.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={cn(
                  "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{procedure.name}</h3>
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    Save {procedure.averageSavings}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{procedure.typicalDuration}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Procedure Input */}
      <div className="mt-8 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Don't see your procedure?
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your procedure..."
            value={customProcedure}
            onChange={(e) => setCustomProcedure(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomProcedure()}
          />
          <button
            onClick={handleCustomProcedure}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcedureStep;
