import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Option {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  badge?: string;
}

interface OptionCardProps {
  option: Option;
  onSelect?: (option: Option) => void;
}

const OptionCard = ({ option, onSelect }: OptionCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        "bg-card border-border"
      )}
      onClick={() => onSelect?.(option)}
    >
      <CardContent className="p-0">
        {option.imageUrl && (
          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
            <img
              src={option.imageUrl}
              alt={option.title}
              className="w-full h-full object-cover"
            />
            {option.badge && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                {option.badge}
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
          {option.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {option.description}
            </p>
          )}
          {option.price && (
            <p className="text-sm font-medium text-primary">{option.price}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionCard;
