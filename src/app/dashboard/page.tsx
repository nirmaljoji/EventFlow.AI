"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MyAssistant } from "@/components/MyAssistant";
import {
  useAssistantInstructions,
  useAssistantTool,
} from "@assistant-ui/react";
import { authService } from '@/app/services/auth';
import { DashboardNav } from './components/DashboardNav';
import EventManager from './components/EventManager';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  // Initial assistant width - making it wider (33% instead of 25%)
  const [assistantWidth, setAssistantWidth] = useState(33);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.replace('/');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Handle the resize functionality
  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.userSelect = 'none'; // Prevent text selection during drag
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      // Calculate new width based on mouse position
      const containerWidth = document.body.clientWidth;
      const newAssistantWidth = 100 - (e.clientX / containerWidth * 100);
      
      // Set limits to prevent panels from becoming too small
      if (newAssistantWidth >= 20 && newAssistantWidth <= 80) {
        setAssistantWidth(newAssistantWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col">
      <DashboardNav />
      <main className="flex-1 overflow-hidden flex">
        {/* Task Manager with dynamic width */}
        <div className="h-full overflow-hidden" style={{ width: `${100 - assistantWidth}%` }}>
          <EventManager />
        </div>
        
        {/* Resizer handle */}
        <div 
          className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 active:bg-blue-700" 
          onMouseDown={handleMouseDown}
        />
        
        {/* Chat Assistant with dynamic width */}
        <div className="h-full overflow-hidden border-l" style={{ width: `${assistantWidth}%` }}>
          <MyAssistant />
        </div>
      </main>
    </div>
  );
}