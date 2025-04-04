import { License } from "@/lib/types";
import { LicenseCard } from "@/components/ui/LicenseCard";
import { X, Plus, FileCheck, Building, Utensils, ShieldCheck, Music, Truck } from "lucide-react";
import { ActionButtons } from "./ActionButtons";
import { RenderFunctionStatus } from "@copilotkit/react-core";

export type AddLicensesProps = {
  args: any;
  status: RenderFunctionStatus;
  handler: any;
};

export const AddLicenses = ({ args, status, handler }: AddLicensesProps) => {
  const getIconForType = (type: string): React.ElementType => {
    switch (type.toLowerCase()) {
      case "venue":
        return Building;
      case "food & beverage":
        return Utensils;
      case "safety":
        return ShieldCheck;
      case "entertainment":
        return Music;
      case "logistics":
        return Truck;
      default:
        return FileCheck;
    }
  };

  // Ensure licenses have all required properties
  const processedLicenses = args.licenses?.map((license: any) => {
    const icon = getIconForType(license.type || "");
    
    // Create a license object with all required properties
    return {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: license.name || "",
      type: license.type || "",
      description: license.description || "",
      status: "pending",
      dueDate: new Date().toISOString().split('T')[0],
      issuingAuthority: license.issuing_authority || "",
      cost: license.cost || 0,
      icon,
      requiredFields: [],
      documents: license.required_documents?.map((doc: string) => ({
        name: doc,
        uploaded: false
      })) || [],
      notes: license.notes || ""
    } as License;
  });

  return (
    <div className="w-full bg-secondary p-4 rounded-lg">
      <h1 className="text-sm mb-3">The following licenses will be added:</h1>
      <div className="space-y-2"> {/* Reduced spacing between cards */}
        {processedLicenses?.map((license: License, index: number) => (
          <div key={`${license.name}-${index}`}>
            {index > 0 && <div className="border-t border-border/30 my-2" />} {/* Lighter separator */}
            <LicenseCard license={license} />
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