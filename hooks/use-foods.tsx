"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { Food, FoodAgentState } from "@/lib/langgraphtypes";
import { AddFoods } from "@/components/ai-chat/chat-sidebar/components/AddFoods";
import { useToast } from "@/components/ui/use-toast";

type FoodsContextType = {
  foods: Food[];
  addFoods: (foods: Food[]) => Promise<Food[]>;
  getFoodById: (id: number) => Food | undefined;
};

const FoodsContext = createContext<FoodsContextType | undefined>(undefined);

export const FoodsProvider = ({ children }: { children: ReactNode }) => {
  const { state, setState } = useCoAgent<FoodAgentState>({
    name: "Food_Agent",
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

  const getFoodById = useMemo(() => (id: number) => {
    return state.foods?.find(food => food.id === id);
  }, [state.foods]);

  const addFoods = async (foods_arr: Food[]) => {
    try {
      const newFoods = foods_arr.map(food => ({
        ...food,
        id: Date.now() + Math.floor(Math.random() * 1000) // Ensure unique ID
      }));
      
      setState(prev => {
        if (!prev) return { foods: newFoods };
        return {
          ...prev,
          foods: [...(prev.foods || []), ...newFoods]
        };
      });
      
      toast({
        title: "Success",
        description: "Food items have been added to the event."
      });
      return newFoods;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food items. Please try again."
      });
      throw error;
    }
  };

  return (
    <FoodsContext.Provider value={{
      foods: state.foods || [],
      addFoods,
      getFoodById
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