import { Food } from "@/lib/types";
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
    <div className="space-y-4 w-full bg-secondary p-6 rounded-lg">

      <h1 className="text-sm">The following food items will be added:</h1>
      {args.foods?.map((food: Food, index: number) => (
        <div key={`${food.id}-${index}`} className="flex flex-col gap-4">
          <hr className="my-2" />
          <FoodCard food={food} />
        </div>
      ))}
      <ActionButtons 
        status={status} 
        handler={handler} 
        approve={<><Plus className="w-4 h-4 mr-2" /> Add</>} 
        reject={<><X className="w-4 h-4 mr-2" /> Cancel</>} 
      />
    </div>
  );
}