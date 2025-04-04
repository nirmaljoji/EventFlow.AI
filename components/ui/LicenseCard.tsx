import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { License } from "@/lib/langgraphtypes";
import { 
  Utensils, 
  Coffee, 
  IceCream, 
  Leaf, 
  Wheat, 
  Milk,
  CircleCheck,
  FileCheck
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LicenseCardProps = {
  license: License;
  className?: string;
  number?: number;
  actions?: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export function LicenseCard({ license, actions, onMouseEnter, onMouseLeave, className, number }: LicenseCardProps) {
  const getLicenseTypeIcon = () => {
    switch(license.name?.toLowerCase()) {
      case "Venue":
        return <Leaf className="w-3 h-3" />;
      case "Food & Beverage":
        return <Coffee className="w-3 h-3" />;
      case "Safety":
        return <IceCream className="w-3 h-3" />;
      case "Entertainment":
        return <Milk className="w-3 h-3" />;
      case "Logistics":
        return <Utensils className="w-3 h-3" />;
    }
  };

  const getLicenseTypeInfo = () => {
    switch(license.issuing_authority?.toLowerCase()) {
      case "Venue":
        return { 
          icon: <Leaf className="w-3 h-3" />, 
          color: "bg-green-100 text-green-800 border-green-200" 
        };
      case "Food & Beverage":
        return { 
          icon: <Leaf className="w-3 h-3" />, 
          color: "bg-emerald-100 text-emerald-800 border-emerald-200" 
        };
      case "Safety":
        return { 
          icon: <Wheat className="w-3 h-3" />, 
          color: "bg-amber-100 text-amber-800 border-amber-200" 
        };
      case "Entertainment":
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

// Get color for license type
  const getTypeColor = () => {
    switch(license.issuing_authority?.toLowerCase()) {
      case "  Venue":
        return "bg-green-100 text-green-800 border-green-200";
      case "Food & Beverage":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Safety":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Entertainment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Logistics":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Entertainment":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const licenseTypeInfo = getLicenseTypeInfo();

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
            <h3 className="text-sm font-medium leading-tight">{license.name}</h3>
            <div className="flex items-center gap-1">
              {license.cost && (
                <span className="text-xs font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                  ${license.cost}
                </span>
              )}
              {actions && <div className="flex-shrink-0">{actions}</div>}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 items-center">
            <Badge 
              variant="outline" 
              className={cn("flex items-center gap-1 px-1.5 py-0.5 text-xs font-normal", getTypeColor())}
            >
              <span>{license.issuing_authority}</span>
            </Badge>
          </div>

                    {/* Notes section */}
                    {license.notes && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p className="line-clamp-2">{license.notes}</p>
            </div>
          )}
          
          {/* Required documents section */}
          {license.required_documents && license.required_documents.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 text-xs mb-2">
                <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium text-blue-700">Required Documents</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {license.required_documents.map((doc, idx) => {
                  // Rotate through different colors for document badges
                  const colors = [
                    "bg-blue-50 text-blue-700 border-blue-200",
                    "bg-purple-50 text-purple-700 border-purple-200",
                    "bg-pink-50 text-pink-700 border-pink-200",
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                    "bg-amber-50 text-amber-700 border-amber-200"
                  ];
                  const colorClass = colors[idx % colors.length];
                  
                  return (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className={`px-2 py-1 text-xs font-medium ${colorClass} shadow-sm`}
                    >
                      {doc}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}