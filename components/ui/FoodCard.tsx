import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Food  } from "@/lib/types";
import { MapPin, Info } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FoodCardProps = {
  food: Food;
  className?: string;
  number?: number;
  actions?: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function FoodCard({ food, actions, onMouseEnter, onMouseLeave, className, number }: FoodCardProps) {
  return (
    <Card 
      className={cn("hover:shadow-md transition-shadow duration-200", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                {number && (
                  <div className="text-sm text-background drop-shadow-md bg-foreground rounded-full flex items-center justify-center font-bold border-2 border-white w-7 h-7">
                    {number}
                  </div>
                )}
                {food.name}
              </CardTitle>
            </div>
            {actions}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{food.type}</span>
            </div>
            {food.dietary && (
              <div className="flex items-center gap-2 pt-2">
                <Info className="w-4 h-4" />
                <p className="flex-1">{food.dietary}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 