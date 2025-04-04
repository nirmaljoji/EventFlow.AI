import { License } from "@/lib/langgraphtypes";
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
  return (
    <div className="w-full bg-secondary p-4 rounded-lg">
      <h1 className="text-sm mb-3">The following licenses will be added:</h1>
      <div className="space-y-2"> {/* Reduced spacing between cards */}
        {args.licenses?.map((license: License, index: number) => (
          <div key={`${license.issuing_authority}-${index}`}>
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