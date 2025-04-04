export type License = {
    name: string;
    issuing_authority: string;
    cost: number;
    required_documents: string[];
    notes: string;
  };

  export type Food = {
    id: number;
    name: string;
    type: string
    dietary: string;
  };
  export type FoodAgentState = {
    foods: Food[];
  };

  export type LicensesAgentState = {
    licenses: License[];
  };
