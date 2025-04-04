export type License = {
    name: string;
    issuing_authority: string;
    cost: number;
    required_documents: string[];
    notes: string;
    type: string;
  };

  export type Food = {
    id: number;
    name: string;
    type: string
    dietary: string;
  };

  export type FoodAnalytics = {
    menu_item_count: number;
    dietary_options_count: number;
    dietary_breakdown: Record<string, number>;
    type_breakdown: Record<string, number>;
  };
  
  export type FoodAgentState = {
    foods: Food[];
    analytics: FoodAnalytics;
  };

  export type LicensesAgentState = {
    licenses: License[];
  };
