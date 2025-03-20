"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { AuthCard } from './AuthCard';

export function HeroSection() {
  return (
    <section className="pt-32 pb-24 px-4 relative">
      <div className="absolute top-0 right-0 -translate-y-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="text-blue-600 font-medium mb-2">AI-Powered Event Management</h5>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-4">
              Orchestrate Perfect Events with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Agentic AI</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 md:pr-10">
              Multiple specialized AI agents work in concert to handle every aspect of your event planning process, from permits to social media, budgeting to logistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={`/api/placeholder/32/32`} alt="User avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600">From 2,000+ planners worldwide</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <AuthCard />
      </div>
    </section>
  );
}