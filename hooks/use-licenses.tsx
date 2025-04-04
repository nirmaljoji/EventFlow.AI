import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { createContext, useContext, ReactNode } from "react";
import { License, LicensesAgentState } from "@/lib/langgraphtypes";
import { AddLicenses } from "@/components/ai-chat/chat-sidebar/components/AddLicenses";
import { useToast } from "@/components/ui/use-toast";
import { FileCheck, Building, Utensils, ShieldCheck, Music, Truck } from "lucide-react";

type LicensesContextType = {
  licenses: License[];
  addLicenses: (licenses: License[]) => Promise<void>;
};

const LicensesContext = createContext<LicensesContextType | undefined>(undefined);

export const LicensesProvider = ({ children }: { children: ReactNode }) => {
  const { state, setState } = useCoAgent<LicensesAgentState>({
    name: "License_Agent",
    initialState: {
      licenses: []
    }
  });
  
  const { toast } = useToast();

  useCopilotAction({ 
    name: "add_licenses",
    description: "Add licenses to the event",
    parameters: [
      {
        name: "licenses",
        type: "object[]",
        description: "The licenses to add to the event",
        required: true,
      }
    ],
    renderAndWait: AddLicenses
  });


  const addLicenses = async (licenses_arr: License[]) => {
    console.log("Adding licenses", licenses_arr);
    try {

      setState({ ...state, licenses: [...(state.licenses || []), ...licenses_arr] });
      toast({
        title: "Success",
        description: "Licenses have been added to the event."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add licenses. Please try again."
      });
    }
  };

  return (
    <LicensesContext.Provider value={{ 
      licenses: state.licenses || { items: [] }, 
      addLicenses
    }}>
      {children}
    </LicensesContext.Provider>
  );
};

export const useLicenses = () => {
  const context = useContext(LicensesContext);
  if (context === undefined) {
    throw new Error("useLicenses must be used within a LicensesProvider");
  }
  return context;
};