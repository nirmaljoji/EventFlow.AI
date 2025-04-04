import { Food } from "@/lib/langgraphtypes";
import { FoodCard } from "@/components/ui/FoodCard";
import { X, Plus } from "lucide-react";
import { ActionButtons } from "./ActionButtons";
import { RenderFunctionStatus } from "@copilotkit/react-core";

export type AddFoodsProps = {
  args: any;
  status: RenderFunctionStatus;
  handler: any;
};

export const AddFoods = ({ args, status, handler }: AddFoodsProps) => {
  return (
    <div className="w-full bg-secondary p-4 rounded-lg">
      <h1 className="text-sm mb-3">The following food items will be added:</h1>
      <div className="space-y-2"> {/* Reduced spacing between cards */}
        {args.foods?.map((food: Food, index: number) => (
          <div key={`${food.id}-${index}`}>
            {index > 0 && <div className="border-t border-border/30 my-2" />} {/* Lighter separator */}
            <FoodCard food={food} />
          </div>
        ))}
      </div>
      <div className="mt-4"> {/* Added margin top for action buttons */}
        <ActionButtons 
          status={status} 
          handler={handler} 
          approve={<><Plus className="w-4 h-4 mr-2" /> Add</>} 
          reject={<><X className="w-4 h-4 mr-2" /> Cancel</>} 
        />
      </div>
    </div>
  );
};
