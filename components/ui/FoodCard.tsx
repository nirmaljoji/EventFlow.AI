import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Food } from "@/lib/types";
import { 
  Utensils, 
  Coffee, 
  IceCream, 
  Leaf, 
  Wheat, 
  Milk,
  CircleCheck
} from "lucide-react";
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
  // Get appropriate icon for food type
  const getFoodTypeIcon = () => {
    switch(food.type?.toLowerCase()) {
      case "main":
        return <Utensils className="w-3 h-3" />;
      case "starter":
        return <Coffee className="w-3 h-3" />;
      case "dessert":
        return <IceCream className="w-3 h-3" />;
      default:
        return <Utensils className="w-3 h-3" />;
    }
  };

  // Get appropriate icon and color for dietary restriction
  const getDietaryInfo = () => {
    switch(food.dietary?.toLowerCase()) {
      case "vegetarian":
        return { 
          icon: <Leaf className="w-3 h-3" />, 
          color: "bg-green-100 text-green-800 border-green-200" 
        };
      case "vegan":
        return { 
          icon: <Leaf className="w-3 h-3" />, 
          color: "bg-emerald-100 text-emerald-800 border-emerald-200" 
        };
      case "gluten-free":
        return { 
          icon: <Wheat className="w-3 h-3" />, 
          color: "bg-amber-100 text-amber-800 border-amber-200" 
        };
      case "dairy-free":
        return { 
          icon: <Milk className="w-3 h-3" />, 
          color: "bg-blue-100 text-blue-800 border-blue-200" 
        };
      default:
        return { 
          icon: <CircleCheck className="w-3 h-3" />, 
          color: "bg-gray-100 text-gray-800 border-gray-200" 
        };
    }
  };

  // Get color for food type
  const getTypeColor = () => {
    switch(food.type?.toLowerCase()) {
      case "main":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "starter":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "dessert":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const dietaryInfo = getDietaryInfo();

  return (
    <Card 
      className={cn(
        "hover:shadow-sm transition-shadow duration-150 border border-border/40",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="p-3 flex items-center gap-2">
        {number && (
          <div className="text-xs text-background bg-foreground rounded-full flex items-center justify-center font-bold w-5 h-5 flex-shrink-0">
            {number}
          </div>
        )}
        
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1.5">
            <h3 className="text-sm font-medium leading-tight">{food.name}</h3>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>
          
          <div className="flex flex-wrap gap-1.5 items-center">
            <Badge 
              variant="outline" 
              className={cn("flex items-center gap-1 px-1.5 py-0.5 text-xs font-normal", getTypeColor())}
            >
              {getFoodTypeIcon()}
              <span>{food.type}</span>
            </Badge>
            
            {food.dietary && (
              <Badge 
                variant="outline" 
                className={cn("flex items-center gap-1 px-1.5 py-0.5 text-xs font-normal", dietaryInfo.color)}
              >
                {dietaryInfo.icon}
                <span>{food.dietary}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}