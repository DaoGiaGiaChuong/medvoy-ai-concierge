import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Mail, Phone, MessageSquare, Smile, Meh, Frown } from "lucide-react";
import { useState } from "react";

interface ContactData {
  name: string;
  email: string;
  phone: string;
  communicationPreference: string[];
  anxietyLevel: number;
}

interface ContactStepProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

const communicationOptions = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
];

const ContactStep = ({ data, onChange }: ContactStepProps) => {
  const [anxietyLevel, setAnxietyLevel] = useState([data.anxietyLevel || 50]);

  const handleAnxietyChange = (values: number[]) => {
    setAnxietyLevel(values);
    onChange({ ...data, anxietyLevel: values[0] });
  };

  const toggleCommunication = (id: string) => {
    const newPrefs = data.communicationPreference.includes(id)
      ? data.communicationPreference.filter(p => p !== id)
      : [...data.communicationPreference, id];
    onChange({ ...data, communicationPreference: newPrefs });
  };

  const getAnxietyLabel = () => {
    if (anxietyLevel[0] < 33) return { label: "Nervous", icon: Frown, color: "text-amber-500" };
    if (anxietyLevel[0] < 66) return { label: "Cautiously Optimistic", icon: Meh, color: "text-blue-500" };
    return { label: "Excited!", icon: Smile, color: "text-green-500" };
  };

  const anxietyInfo = getAnxietyLabel();
  const AnxietyIcon = anxietyInfo.icon;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
        <p className="text-muted-foreground">Let us know how to reach you with your personalized results</p>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-semibold">
            Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Communication Preference */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">How would you like us to communicate?</Label>
        <div className="grid grid-cols-2 gap-3">
          {communicationOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = data.communicationPreference.includes(option.id);
            
            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  isSelected 
                    ? "border-primary bg-primary/5 ring-2 ring-primary" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => toggleCommunication(option.id)}
              >
                <Checkbox checked={isSelected} />
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{option.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anxiety Level */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">How are you feeling about medical travel?</Label>
        <p className="text-sm text-muted-foreground">This helps us tailor our communication style to your needs</p>
        
        <div className="space-y-4 pt-2">
          <Slider
            value={anxietyLevel}
            onValueChange={handleAnxietyChange}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Nervous</span>
            <span>Excited</span>
          </div>
          
          <div className={cn("flex items-center justify-center gap-2 p-4 rounded-lg bg-muted", anxietyInfo.color)}>
            <AnxietyIcon className="h-6 w-6" />
            <span className="font-semibold">{anxietyInfo.label}</span>
          </div>
        </div>
        
        {anxietyLevel[0] < 50 && (
          <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
            💙 We understand medical travel can feel overwhelming. We're here to guide you every step of the way with clear information and 24/7 support.
          </p>
        )}
      </div>

      {/* Privacy Note */}
      <div className="p-4 bg-muted/50 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          🔒 Your information is secure and will only be used to provide you with personalized recommendations. 
          We never share your data with third parties without your consent.
        </p>
      </div>
    </div>
  );
};

export default ContactStep;
