import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitalId: string;
  hospitalName: string;
  conversationId: string | null;
}

const ConsultationDialog = ({
  open,
  onOpenChange,
  hospitalId,
  hospitalName,
  conversationId,
}: ConsultationDialogProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save consultation inquiry (HIPAA compliant - no PHI)
      const { error } = await supabase
        .from("customer_inquiries")
        .insert({
          email: email.trim().toLowerCase(),
          hospital_id: hospitalId,
          inquiry_type: "consultation",
          conversation_id: conversationId,
          status: "pending",
        });

      if (error) throw error;

      setSubmitted(true);
      
      toast({
        title: "Request Submitted",
        description: "We'll contact you within 24 hours with more details.",
      });

      // Reset after 2 seconds and close
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
        onOpenChange(false);
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit consultation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Request Consultation</DialogTitle>
              <DialogDescription>
                Interested in <span className="font-semibold text-foreground">{hospitalName}</span>? 
                Provide your email and we'll get back to you within 24 hours with personalized details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your privacy is protected. We comply with HIPAA regulations.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="flex-1"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>

              <div className="pt-2 border-t">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    onOpenChange(false);
                    navigate(`/hospital/${hospitalId}`);
                  }}
                  className="w-full text-sm"
                >
                  View Hospital Details
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Request Submitted!
            </h3>
            <p className="text-sm text-muted-foreground">
              We'll contact you at {email} within 24 hours.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDialog;
