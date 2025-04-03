import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { createContext, useContext, ReactNode } from "react";
import { Food, AgentState } from "@/lib/types";
import { AddFoods } from "@/components/ai-chat/chat-sidebar/components/AddFoods";
import { useToast } from "@/components/ui/use-toast";

type FoodsContextType = {
  foods: Food[];
  addFoods: (foods: Food[]) => Promise<void>;
};

const FoodsContext = createContext<FoodsContextType | undefined>(undefined);

export const FoodsProvider = ({ children }: { children: ReactNode }) => {
  const { state, setState } = useCoAgent<AgentState>({
    name: "eventflow_agent",
    initialState: {
      foods: []
    }
  });
  
  const { toast } = useToast();

  useCopilotAction({ 
    name: "add_foods",
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

  const addFoods = async (foods_arr: Food[]) => {


    console.log("Adding foods", state);
    try {
      setState({ ...state, foods: [...(state.foods || []), ...foods_arr] });
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