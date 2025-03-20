"use client";

import React from 'react';
import { Globe } from 'lucide-react';

export function PartnersSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-slate-500">Trusted by industry leaders worldwide</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="h-10 w-24 bg-slate-200 rounded flex items-center justify-center">
                <Globe size={24} className="text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}