import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface IntakeProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const IntakeProgress = ({ currentStep, totalSteps, steps }: IntakeProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div 
                    className={cn(
                      "h-1 flex-1 transition-colors duration-300",
                      stepNumber <= currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "h-1 flex-1 transition-colors duration-300",
                      stepNumber < currentStep ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 text-center hidden md:block",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntakeProgress;
