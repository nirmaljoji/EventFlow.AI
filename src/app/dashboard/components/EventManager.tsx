"use client";

import { useState } from "react";
import Overview from "./Overview";
import Guests from "./Guests";
import Food from "./Food";
import Decoration from "./Decoration";
import Licenses from "./Licences";

import { Button } from "@/components/ui/button";
import { BarChart3, Users, Utensils, Palette, FileCheck } from "lucide-react";

export default function EventManager() {
  const [activeView, setActiveView] = useState("overview");

  const navOptions = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "guests", label: "Guests", icon: <Users className="h-5 w-5" /> },
    { id: "food", label: "Food & Beverages", icon: <Utensils className="h-5 w-5" /> },
    { id: "decoration", label: "Decoration", icon: <Palette className="h-5 w-5" /> },
    { id: "licenses", label: "Licenses & Permits", icon: <FileCheck className="h-5 w-5" /> }
  ];

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeView === "overview" && <Overview />}
        {activeView === "guests" && <Guests />}
        {activeView === "food" && <Food />}
        {activeView === "decoration" && <Decoration />}
        {activeView === "licenses" && <Licenses />}
      </div>

      {/* Permanently Expanded Navigation Menu Positioned at the Bottom */}
      <div 
        id="floating-nav"
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-1 flex gap-1">
          {navOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveView(option.id)}
              className={`
                p-2 rounded-lg flex items-center justify-center gap-2
                transition-all duration-200
                ${
                  activeView === option.id 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                    : "hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-700 dark:text-slate-300"
                }
              `}
            >
              {option.icon}
              <span className="text-sm font-medium whitespace-nowrap">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}