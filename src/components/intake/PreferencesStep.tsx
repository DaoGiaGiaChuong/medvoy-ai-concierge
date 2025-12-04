import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DollarSign, Languages, Hotel, Clock, Award, Users } from "lucide-react";

interface PreferencesData {
  priorities: string[];
  travelCompanion: "alone" | "companion" | "undecided";
  hotelPreference: "budget" | "mid-range" | "luxury";
}

interface PreferencesStepProps {
  data: PreferencesData;
  onChange: (data: PreferencesData) => void;
}

const priorityOptions = [
  { id: "lowest_cost", label: "Lowest Cost", icon: DollarSign, desc: "I want the most affordable option" },
  { id: "english_speaking", label: "English-Speaking Staff", icon: Languages, desc: "Communication is important to me" },
  { id: "luxury_accommodations", label: "Luxury Accommodations", icon: Hotel, desc: "I want a comfortable stay" },
  { id: "quick_recovery", label: "Quick Recovery", icon: Clock, desc: "Minimize time away from home" },
  { id: "experienced_surgeon", label: "Most Experienced Surgeon", icon: Award, desc: "I want the best credentials" },
];

const companionOptions = [
  { value: "alone", label: "Traveling Alone", desc: "I'm comfortable managing on my own" },
  { value: "companion", label: "With a Companion", desc: "A friend or family member will join me" },
  { value: "undecided", label: "Undecided", desc: "I haven't decided yet" },
];

const hotelOptions = [
  { value: "budget", label: "Budget-Friendly", price: "$30-60/night", desc: "Clean, basic accommodations" },
  { value: "mid-range", label: "Mid-Range", price: "$60-120/night", desc: "Comfortable hotels with amenities" },
  { value: "luxury", label: "Luxury", price: "$120+/night", desc: "Premium hotels and resorts" },
];

const PreferencesStep = ({ data, onChange }: PreferencesStepProps) => {
  const handlePriorityToggle = (priorityId: string) => {
    const newPriorities = data.priorities.includes(priorityId)
      ? data.priorities.filter(p => p !== priorityId)
      : [...data.priorities, priorityId];
    onChange({ ...data, priorities: newPriorities });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Travel Preferences</h2>
        <p className="text-muted-foreground">Help us personalize your experience</p>
      </div>

      {/* Priority Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">What matters most to you? (Select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {priorityOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = data.priorities.includes(option.id);
            
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  isSelected 
                    ? "border-primary bg-primary/5 ring-2 ring-primary" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handlePriorityToggle(option.id)}
              >
                <Checkbox checked={isSelected} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Travel Companion */}
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Will you be traveling alone or with a companion?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {companionOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all text-center",
                data.travelCompanion === option.value 
                  ? "border-primary bg-primary/5 ring-2 ring-primary" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onChange({ ...data, travelCompanion: option.value as PreferencesData["travelCompanion"] })}
            >
              <h4 className="font-semibold">{option.label}</h4>
              <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Preference */}
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Hotel className="h-5 w-5" />
          Hotel Preference
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hotelOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all",
                data.hotelPreference === option.value 
                  ? "border-primary bg-primary/5 ring-2 ring-primary" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onChange({ ...data, hotelPreference: option.value as PreferencesData["hotelPreference"] })}
            >
              <h4 className="font-semibold">{option.label}</h4>
              <p className="text-xs text-primary font-medium">{option.price}</p>
              <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesStep;
