"use client";

import { useEffect, useState } from 'react';

interface Event {
  _id: string;
  eventName: string;
  location: string;
  dateTime: string;
  attendees: number;
  description: string;
}

export default function UserEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${apiUrl}/api/events/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.events || []);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };
    
    fetchUserEvents();
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  
  if (events.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="mb-4">You haven't created any events yet.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Events</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <div key={event._id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p className="text-gray-500 mb-2">
              {new Date(event.dateTime).toLocaleDateString()} at {new Date(event.dateTime).toLocaleTimeString()}
            </p>
            <p className="mb-2"><strong>Location:</strong> {event.location}</p>
            <p className="mb-2"><strong>Attendees:</strong> {event.attendees}</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}