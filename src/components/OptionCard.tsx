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
        "group cursor-pointer transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.03] hover:border-primary/50",
        "active:scale-[0.98]",
        "bg-card border-2 border-border",
        "relative overflow-hidden"
      )}
      onClick={() => onSelect?.(option)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-0 relative">
        {option.imageUrl && (
          <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
            <img
              src={option.imageUrl}
              alt={option.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {option.badge && (
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                {option.badge}
              </div>
            )}
          </div>
        )}
        <div className="p-5">
          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {option.title}
          </h3>
          {option.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {option.description}
            </p>
          )}
          {option.price && (
            <p className="text-base font-semibold text-primary">{option.price}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptionCard;
