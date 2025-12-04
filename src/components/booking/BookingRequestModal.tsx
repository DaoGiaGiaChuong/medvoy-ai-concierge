import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle, Clock, Mail } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  location: string;
  country: string;
}

interface BookingRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitals: Hospital[];
  preSelectedHospitalId?: string;
}

const BookingRequestModal = ({ open, onOpenChange, hospitals, preSelectedHospitalId }: BookingRequestModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    procedure: "",
    preferredDate: undefined as Date | undefined,
    message: "",
    selectedHospitals: preSelectedHospitalId ? [preSelectedHospitalId] : [] as string[],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });
  }, []);

  useEffect(() => {
    if (preSelectedHospitalId && !formData.selectedHospitals.includes(preSelectedHospitalId)) {
      setFormData(prev => ({ ...prev, selectedHospitals: [preSelectedHospitalId] }));
    }
  }, [preSelectedHospitalId]);

  const toggleHospital = (hospitalId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedHospitals: prev.selectedHospitals.includes(hospitalId)
        ? prev.selectedHospitals.filter(id => id !== hospitalId)
        : [...prev.selectedHospitals, hospitalId].slice(0, 5) // Max 5 hospitals
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || formData.selectedHospitals.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, and select at least one clinic.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking inquiries for each selected hospital
      const inquiries = formData.selectedHospitals.map(hospitalId => ({
        user_id: user?.id || null,
        hospital_id: hospitalId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: `Procedure: ${formData.procedure}\nPreferred Date: ${formData.preferredDate ? format(formData.preferredDate, "PPP") : "Flexible"}\n\n${formData.message}`,
        status: "pending",
      }));

      const { error } = await supabase
        .from("booking_inquiries")
        .insert(inquiries);

      if (error) throw error;

      setStep("confirmation");
    } catch (error: any) {
      console.error("Error submitting booking request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      name: user?.email ? formData.name : "",
      email: user?.email || "",
      phone: "",
      procedure: "",
      preferredDate: undefined,
      message: "",
      selectedHospitals: [],
    });
    onOpenChange(false);
  };

  if (step === "confirmation") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl mb-2">Request Sent!</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Your quote request has been sent to {formData.selectedHospitals.length} clinic{formData.selectedHospitals.length > 1 ? "s" : ""}.
            </DialogDescription>
            
            <div className="bg-muted p-4 rounded-lg text-left mb-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                What happens next?
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Clinics typically respond within 24-48 hours</li>
                <li>• You'll receive quotes via email at {formData.email}</li>
                <li>• Compare quotes in your dashboard</li>
                <li>• Quotes are valid for 30 days</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="flex-1" onClick={() => { handleClose(); navigate("/dashboard"); }}>
                View My Requests
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Get personalized quotes from top clinics. We'll handle the communication for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hospital Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Clinics (up to 5)</Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
              {hospitals.map((hospital) => {
                const isSelected = formData.selectedHospitals.includes(hospital.id);
                return (
                  <div
                    key={hospital.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleHospital(hospital.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <p className="text-sm text-muted-foreground">{hospital.location}</p>
                      </div>
                      {isSelected && <Badge>Selected</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.selectedHospitals.length} of 5 clinics selected
            </p>
          </div>

          {/* Procedure */}
          <div className="space-y-2">
            <Label htmlFor="procedure">Procedure You're Interested In</Label>
            <Input
              id="procedure"
              placeholder="e.g., Dental Veneers, Rhinoplasty"
              value={formData.procedure}
              onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
            />
          </div>

          {/* Preferred Date */}
          <div className="space-y-2">
            <Label>Preferred Travel Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.preferredDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.preferredDate ? format(formData.preferredDate, "PPP") : "Select a date (optional)"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.preferredDate}
                  onSelect={(date) => setFormData({ ...formData, preferredDate: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your specific needs, medical history considerations, or any questions..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSubmit}
              disabled={isSubmitting || formData.selectedHospitals.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Request to {formData.selectedHospitals.length} Clinic{formData.selectedHospitals.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingRequestModal;
