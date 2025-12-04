import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addMonths } from "date-fns";
import { CalendarIcon, DollarSign } from "lucide-react";
import { useState } from "react";

interface BudgetTimelineData {
  budgetMin: number;
  budgetMax: number;
  travelDateStart: Date | undefined;
  travelDateEnd: Date | undefined;
  flexibility: "flexible" | "specific" | "within3months";
}

interface BudgetTimelineStepProps {
  data: BudgetTimelineData;
  onChange: (data: BudgetTimelineData) => void;
}

const BudgetTimelineStep = ({ data, onChange }: BudgetTimelineStepProps) => {
  const [budgetRange, setBudgetRange] = useState<number[]>([data.budgetMin || 1000, data.budgetMax || 10000]);

  const handleBudgetChange = (values: number[]) => {
    setBudgetRange(values);
    onChange({ ...data, budgetMin: values[0], budgetMax: values[1] });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Budget & Timeline</h2>
        <p className="text-muted-foreground">Help us understand your budget and when you'd like to travel</p>
      </div>

      {/* Budget Slider */}
      <div className="space-y-6">
        <Label className="text-base font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Your Total Budget (including procedure, travel, & stay)
        </Label>
        
        <div className="px-4">
          <Slider
            value={budgetRange}
            onValueChange={handleBudgetChange}
            min={1000}
            max={25000}
            step={500}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Minimum</span>
            <p className="text-xl font-bold text-primary">{formatCurrency(budgetRange[0])}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Maximum</span>
            <p className="text-xl font-bold text-primary">{formatCurrency(budgetRange[1])}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          💡 Tip: Most patients spend between $3,000-$8,000 for procedures in Vietnam including all travel costs
        </p>
      </div>

      {/* Travel Flexibility */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">When are you planning to travel?</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: "flexible", label: "I'm Flexible", desc: "Open to the best dates" },
            { value: "specific", label: "Specific Dates", desc: "I have dates in mind" },
            { value: "within3months", label: "Within 3 Months", desc: "Sometime soon" },
          ].map((option) => (
            <div
              key={option.value}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all",
                data.flexibility === option.value 
                  ? "border-primary bg-primary/5 ring-2 ring-primary" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onChange({ ...data, flexibility: option.value as BudgetTimelineData["flexibility"] })}
            >
              <h4 className="font-semibold">{option.label}</h4>
              <p className="text-sm text-muted-foreground">{option.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Pickers (shown when specific dates selected) */}
      {data.flexibility === "specific" && (
        <div className="space-y-4">
          <Label className="text-base font-semibold">Select your travel dates</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Earliest departure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.travelDateStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.travelDateStart ? format(data.travelDateStart, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.travelDateStart}
                    onSelect={(date) => onChange({ ...data, travelDateStart: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Latest return</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.travelDateEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.travelDateEnd ? format(data.travelDateEnd, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.travelDateEnd}
                    onSelect={(date) => onChange({ ...data, travelDateEnd: date })}
                    disabled={(date) => date < (data.travelDateStart || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {data.flexibility === "within3months" && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Great choice!</span> We'll find available appointments within the next 3 months 
            (by {format(addMonths(new Date(), 3), "MMMM yyyy")}).
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetTimelineStep;
