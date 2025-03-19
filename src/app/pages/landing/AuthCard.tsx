"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export function AuthCard() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative"
    >
      <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border-0">
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="w-full max-w-md mx-auto"
        >
          <div className="px-6 pt-6 pb-4">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 rounded-lg p-1">
              <TabsTrigger 
                value="login" 
                className={`w-full text-center rounded-md py-2 px-3 font-medium transition-all ${
                  activeTab === 'login' 
                    ? 'bg-white shadow-sm text-blue-700' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={`w-full text-center rounded-md py-2 px-3 font-medium transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white shadow-sm text-blue-700' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                Create Account
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="login" className="px-6 pb-6">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup" className="px-6 pb-6">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-80"></div>
      <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full opacity-80"></div>
      
      {/* 3D decorative element */}
      <div className="absolute -z-10 bottom-10 -right-12 w-24 h-24 rotate-12">
        <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow-lg transform rotate-12"></div>
        <div className="absolute top-2 right-2 w-full h-full bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-lg shadow-lg transform rotate-6"></div>
      </div>
    </motion.div>
  );
}