"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { License, LicensesAgentState } from "@/lib/langgraphtypes";
import { AddLicenses } from "@/components/ai-chat/chat-sidebar/components/AddLicenses";
import { useToast } from "@/components/ui/use-toast";
import { FileCheck, Building, Utensils, ShieldCheck, Music, Truck } from "lucide-react";

type LicensesContextType = {
  licenses: License[];
  addLicenses: (licenses: License[]) => Promise<License[]>;
  getLicenseById: (id: string) => License | undefined;
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

  const getLicenseById = useMemo(() => (id: string) => {
    return state.licenses?.find((license: License & { id?: string }) => license.id === id);
  }, [state.licenses]);

  const addLicenses = async (licenses_arr: License[]) => {
    try {
      const newLicenses = licenses_arr.map(license => ({
        ...license,
        id: (Date.now() + Math.floor(Math.random() * 1000)).toString() // Generate string ID
      }));
      
      setState(prev => {
        if (!prev) return { licenses: newLicenses, foods: [] };
        return {
          ...prev,
          licenses: [...(prev.licenses || []), ...newLicenses]
        };
      });
      
      toast({
        title: "Success",
        description: "Licenses have been added to the event."
      });
      
      return newLicenses;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add licenses. Please try again."
      });
      throw error;
    }
  };

  return (
    <LicensesContext.Provider value={{ 
      licenses: state.licenses || [],
      addLicenses,
      getLicenseById
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