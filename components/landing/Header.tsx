"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' 
        : 'bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-3 shadow-md transform hover:rotate-12 transition-transform">
            <Calendar className="text-white" size={18} />
            <div className="absolute inset-0 bg-white/10 rounded-lg transform -rotate-3"></div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            EventFlow.AI
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors">Features</a>
          <a href="#agents" className="text-slate-700 hover:text-blue-600 transition-colors">Agents</a>
          <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#about" className="text-slate-700 hover:text-blue-600 transition-colors">About</a>
        </nav>
        
        <div>
          <Button variant="ghost" className="text-slate-700 mr-2 hidden md:inline-flex">Sign In</Button>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}