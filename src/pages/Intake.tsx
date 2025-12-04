import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Home, Loader2 } from "lucide-react";
import IntakeProgress from "@/components/intake/IntakeProgress";
import ProcedureStep from "@/components/intake/ProcedureStep";
import MedicalProfileStep from "@/components/intake/MedicalProfileStep";
import BudgetTimelineStep from "@/components/intake/BudgetTimelineStep";
import PreferencesStep from "@/components/intake/PreferencesStep";
import ContactStep from "@/components/intake/ContactStep";

const STEPS = ["Procedure", "Medical Profile", "Budget & Timeline", "Preferences", "Contact"];

interface IntakeFormData {
  // Step 1
  procedure: string;
  // Step 2
  ageRange: string;
  conditions: string[];
  medications: string;
  previousSurgeries: boolean;
  surgeryDetails: string;
  // Step 3
  budgetMin: number;
  budgetMax: number;
  travelDateStart: Date | undefined;
  travelDateEnd: Date | undefined;
  flexibility: "flexible" | "specific" | "within3months";
  // Step 4
  priorities: string[];
  travelCompanion: "alone" | "companion" | "undecided";
  hotelPreference: "budget" | "mid-range" | "luxury";
  // Step 5
  name: string;
  email: string;
  phone: string;
  communicationPreference: string[];
  anxietyLevel: number;
}

const initialFormData: IntakeFormData = {
  procedure: "",
  ageRange: "",
  conditions: [],
  medications: "",
  previousSurgeries: false,
  surgeryDetails: "",
  budgetMin: 3000,
  budgetMax: 10000,
  travelDateStart: undefined,
  travelDateEnd: undefined,
  flexibility: "flexible",
  priorities: [],
  travelCompanion: "undecided",
  hotelPreference: "mid-range",
  name: "",
  email: "",
  phone: "",
  communicationPreference: ["email"],
  anxietyLevel: 50,
};

const Intake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setFormData(prev => ({ ...prev, email: session.user.email || "" }));
      }
    });
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.procedure.length > 0;
      case 2:
        return formData.ageRange.length > 0;
      case 3:
        return formData.budgetMin > 0 && formData.budgetMax > formData.budgetMin;
      case 4:
        return formData.priorities.length > 0;
      case 5:
        return formData.name.length > 0 && formData.email.length > 0 && formData.email.includes("@");
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create or get conversation
      let conversationId: string;
      
      if (user) {
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (convError) throw convError;
        conversationId = conversation.id;
      } else {
        // For anonymous users, create conversation without user_id
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .insert({})
          .select()
          .single();

        if (convError) throw convError;
        conversationId = conversation.id;
      }

      // Store intake data
      const { error: intakeError } = await supabase
        .from("intake_data")
        .insert({
          conversation_id: conversationId,
          procedure: formData.procedure,
          travel_date: formData.flexibility === "specific" 
            ? formData.travelDateStart?.toISOString() 
            : formData.flexibility,
          country: "Vietnam",
          budget: `${formData.budgetMin}-${formData.budgetMax}`,
          companions: formData.travelCompanion,
          hotel_preference: formData.hotelPreference,
        });

      if (intakeError) throw intakeError;

      // Store customer inquiry
      const { error: inquiryError } = await supabase
        .from("customer_inquiries")
        .insert({
          email: formData.email,
          conversation_id: conversationId,
          inquiry_type: "consultation",
          status: "pending",
        });

      if (inquiryError) throw inquiryError;

      toast({
        title: "Consultation Request Submitted!",
        description: "We'll analyze your preferences and send you personalized recommendations.",
      });

      // Navigate to cost estimation with procedure and conversation
      navigate(`/cost-estimate?procedure=${encodeURIComponent(formData.procedure)}&conversation=${conversationId}`);
    } catch (error: any) {
      console.error("Error submitting intake:", error);
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProcedureStep
            selectedProcedure={formData.procedure}
            onSelect={(procedure) => setFormData({ ...formData, procedure })}
          />
        );
      case 2:
        return (
          <MedicalProfileStep
            data={{
              ageRange: formData.ageRange,
              conditions: formData.conditions,
              medications: formData.medications,
              previousSurgeries: formData.previousSurgeries,
              surgeryDetails: formData.surgeryDetails,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 3:
        return (
          <BudgetTimelineStep
            data={{
              budgetMin: formData.budgetMin,
              budgetMax: formData.budgetMax,
              travelDateStart: formData.travelDateStart,
              travelDateEnd: formData.travelDateEnd,
              flexibility: formData.flexibility,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 4:
        return (
          <PreferencesStep
            data={{
              priorities: formData.priorities,
              travelCompanion: formData.travelCompanion,
              hotelPreference: formData.hotelPreference,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      case 5:
        return (
          <ContactStep
            data={{
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              communicationPreference: formData.communicationPreference,
              anxietyLevel: formData.anxietyLevel,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer" 
            onClick={() => navigate("/")}
          >
            MedVoy AI
          </h1>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <IntakeProgress currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get My Personalized Results
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Intake;
