import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { createContext, useContext, ReactNode } from "react";
import { Food, AgentState, FoodList } from "@/lib/types";
import { AddFoods } from "@/components/ai-chat/chat-sidebar/components/AddFoods";
import { useToast } from "@/components/ui/use-toast";

type FoodsContextType = {
  foods: FoodList;
  addFoods: (foodList: FoodList) => Promise<void>;
};

const FoodsContext = createContext<FoodsContextType | undefined>(undefined);

export const FoodsProvider = ({ children }: { children: ReactNode }) => {
  const { state, setState } = useCoAgent<AgentState>({
    name: "foods",
    initialState: {
      foods: []
    }
  });
  
  const { toast } = useToast();

  useCopilotAction({ 
    name: "search_for_food",
    description: "Add food items to the event menu",
    parameters: [
      {
        name: "foods",
        type: "object[]",
        description: "The food items to add to the event",
        required: true,
      }
    ],
    renderAndWait: AddFoods
  });

  const addFoods = async (foodList: FoodList) => {
    try {
      setState({
        ...state,
        foods: {
          items: [...(state.foods?.items || []), ...foodList.items]
        }
      });
      toast({
        title: "Success",
        description: "Food items have been added to the event."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food items. Please try again."
      });
    }
  };

  return (
    <FoodsContext.Provider value={{ 
      foods: state.foods || { items: [] }, 
      addFoods
    }}>
      {children}
    </FoodsContext.Provider>
  );
};

export const useFoods = () => {
  const context = useContext(FoodsContext);
  if (context === undefined) {
    throw new Error("useFoods must be used within a FoodsProvider");
  }
  return context;
};