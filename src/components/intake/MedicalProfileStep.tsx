import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicalProfileData {
  ageRange: string;
  conditions: string[];
  medications: string;
  previousSurgeries: boolean;
  surgeryDetails: string;
}

interface MedicalProfileStepProps {
  data: MedicalProfileData;
  onChange: (data: MedicalProfileData) => void;
}

const commonConditions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Disease",
  "Asthma",
  "Blood Clotting Disorder",
  "Autoimmune Disorder",
  "Allergies",
  "None of the above",
];

const ageRanges = [
  { value: "18-25", label: "18-25 years" },
  { value: "26-35", label: "26-35 years" },
  { value: "36-45", label: "36-45 years" },
  { value: "46-55", label: "46-55 years" },
  { value: "56-65", label: "56-65 years" },
  { value: "65+", label: "65+ years" },
];

const getSafetyTier = (data: MedicalProfileData): { tier: "green" | "yellow" | "red"; message: string } => {
  const highRiskConditions = ["Heart Disease", "Blood Clotting Disorder"];
  const moderateRiskConditions = ["Diabetes", "High Blood Pressure", "Autoimmune Disorder"];
  
  const hasHighRisk = data.conditions.some(c => highRiskConditions.includes(c));
  const hasModerateRisk = data.conditions.some(c => moderateRiskConditions.includes(c));
  const isElderly = data.ageRange === "65+";

  if (hasHighRisk || (hasModerateRisk && isElderly)) {
    return { tier: "red", message: "Doctor consultation recommended before proceeding" };
  }
  if (hasModerateRisk || isElderly) {
    return { tier: "yellow", message: "Clinic review may be recommended" };
  }
  return { tier: "green", message: "No health concerns identified" };
};

const MedicalProfileStep = ({ data, onChange }: MedicalProfileStepProps) => {
  const safetyTier = getSafetyTier(data);

  const handleConditionToggle = (condition: string) => {
    if (condition === "None of the above") {
      onChange({ ...data, conditions: data.conditions.includes(condition) ? [] : [condition] });
    } else {
      const newConditions = data.conditions.includes(condition)
        ? data.conditions.filter(c => c !== condition)
        : [...data.conditions.filter(c => c !== "None of the above"), condition];
      onChange({ ...data, conditions: newConditions });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tell us about your health</h2>
        <p className="text-muted-foreground">This helps us ensure your safety and match you with appropriate clinics</p>
      </div>

      {/* Safety Tier Indicator */}
      {data.ageRange && (
        <div className={cn(
          "p-4 rounded-lg flex items-center gap-3",
          safetyTier.tier === "green" && "bg-green-500/10 border border-green-500/30",
          safetyTier.tier === "yellow" && "bg-yellow-500/10 border border-yellow-500/30",
          safetyTier.tier === "red" && "bg-red-500/10 border border-red-500/30"
        )}>
          {safetyTier.tier === "green" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {safetyTier.tier === "yellow" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          {safetyTier.tier === "red" && <Shield className="h-5 w-5 text-red-500" />}
          <span className="text-sm font-medium">{safetyTier.message}</span>
        </div>
      )}

      {/* Age Range */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Age Range</Label>
        <Select value={data.ageRange} onValueChange={(value) => onChange({ ...data, ageRange: value })}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select your age range" />
          </SelectTrigger>
          <SelectContent>
            {ageRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pre-existing Conditions */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Pre-existing Conditions</Label>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonConditions.map((condition) => (
            <div
              key={condition}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                data.conditions.includes(condition) 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleConditionToggle(condition)}
            >
              <Checkbox
                checked={data.conditions.includes(condition)}
                onCheckedChange={() => handleConditionToggle(condition)}
              />
              <span className="text-sm">{condition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Current Medications</Label>
        <Textarea
          placeholder="List any medications you're currently taking (optional)"
          value={data.medications}
          onChange={(e) => onChange({ ...data, medications: e.target.value })}
          rows={3}
        />
      </div>

      {/* Previous Surgeries */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Previous Surgeries</Label>
        <div className="flex gap-4">
          <div
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors flex-1",
              !data.previousSurgeries ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onClick={() => onChange({ ...data, previousSurgeries: false, surgeryDetails: "" })}
          >
            <Checkbox checked={!data.previousSurgeries} />
            <span>No previous surgeries</span>
          </div>
          <div
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors flex-1",
              data.previousSurgeries ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
            onClick={() => onChange({ ...data, previousSurgeries: true })}
          >
            <Checkbox checked={data.previousSurgeries} />
            <span>Yes, I've had surgeries</span>
          </div>
        </div>
        
        {data.previousSurgeries && (
          <Textarea
            placeholder="Please describe your previous surgeries..."
            value={data.surgeryDetails}
            onChange={(e) => onChange({ ...data, surgeryDetails: e.target.value })}
            rows={3}
          />
        )}
      </div>
    </div>
  );
};

export default MedicalProfileStep;
