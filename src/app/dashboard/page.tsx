"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MyAssistant } from "@/components/MyAssistant";
import { Button } from "@/components/ui/button";
import { authService } from '@/app/services/auth';
import { DashboardNav } from './components/DashboardNav';
import EventManager from './components/EventManager';
import EventForm from './components/EventForm';
import UserEvents from './components/UserEvents';
import { ChevronLeft, ChevronRight, LayoutDashboard, CalendarPlus, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [assistantWidth, setAssistantWidth] = useState(33);
  const isDraggingRef = useRef(false);
  const [activeView, setActiveView] = useState<'notion' | 'createEvent' | 'viewEvents'>('notion');
  
  // Simplified boolean state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        router.replace('/');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Direct toggle function with no complex logic
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle resize functionality
  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const containerWidth = document.body.clientWidth;
      const newAssistantWidth = 100 - (e.clientX / containerWidth * 100);
      
      if (newAssistantWidth >= 20 && newAssistantWidth <= 80) {
        setAssistantWidth(newAssistantWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const onEventCreated = () => {
    setActiveView('viewEvents');
  };

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
      <main className="flex-1 overflow-hidden flex relative">
        {/* Sidebar - Added explicit z-index and pointer-events */}
        <div 
          className="h-full bg-gray-100 dark:bg-gray-800 transition-all duration-300 relative z-30"
          style={{ 
            width: sidebarOpen ? '16rem' : '4rem',
            pointerEvents: 'auto' // Ensure pointer events work
          }}
        >
          {/* Sidebar Header with Toggle Button - Added explicit z-index */}
          <div className="p-4 border-b flex justify-between items-center relative z-30">
            {sidebarOpen && <h2 className="font-semibold">Navigation</h2>}
            {/* Toggle button with explicit styles to ensure clickability */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleToggleSidebar}
              className="ml-auto relative z-40 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </Button>
          </div>
          
          {/* Sidebar Navigation Links - With explicit z-index and pointer-events */}
          <div className="flex-1 py-4 relative z-30">
            <Button
              variant={activeView === 'notion' ? "default" : "ghost"}
              className="w-full mb-2 justify-start px-4 relative z-30 cursor-pointer"
              onClick={() => setActiveView('notion')}
              style={{ pointerEvents: 'auto' }}
            >
              <LayoutDashboard className="mr-2" size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </Button>
            
            <Button
              variant={activeView === 'createEvent' ? "default" : "ghost"}
              className="w-full mb-2 justify-start px-4 relative z-30 cursor-pointer"
              onClick={() => setActiveView('createEvent')}
              style={{ pointerEvents: 'auto' }}
            >
              <CalendarPlus className="mr-2" size={20} />
              {sidebarOpen && <span>Create Event</span>}
            </Button>
            
            <Button
              variant={activeView === 'viewEvents' ? "default" : "ghost"}
              className="w-full mb-2 justify-start px-4 relative z-30 cursor-pointer"
              onClick={() => setActiveView('viewEvents')}
              style={{ pointerEvents: 'auto' }}
            >
              <Calendar className="mr-2" size={20} />
              {sidebarOpen && <span>View Events</span>}
            </Button>
          </div>
        </div>
        
        {/* Content Area - Lowered z-index to prevent overlap */}
        <div className="h-full overflow-hidden flex flex-col flex-1 border-l relative z-20">
          {/* Content header */}
          <div className="border-b p-4">
            <h1 className="text-2xl font-bold">
              {activeView === 'notion' && "Dashboard"}
              {activeView === 'createEvent' && "Create New Event"}
              {activeView === 'viewEvents' && "My Events"}
            </h1>
          </div>
          
          {/* Content body */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeView === 'createEvent' && <EventForm onEventCreated={onEventCreated} />}
            {activeView === 'viewEvents' && <UserEvents />}
            {activeView === 'notion' && <EventManager />}
          </div>
        </div>
        
        {/* Resizer handle - Increased z-index */}
        <div 
          className="w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 active:bg-blue-700 relative z-25" 
          onMouseDown={handleMouseDown}
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Chat Assistant with dynamic width - Lowered z-index */}
        <div className="h-full overflow-hidden border-l relative z-20" style={{ width: `${assistantWidth}%` }}>
          <MyAssistant />
        </div>
      </main>
    </div>
  );
}