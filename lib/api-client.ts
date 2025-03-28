import axios from "axios";
import type { Event } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor to include the token in every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event data structure for API requests
export interface EventCreateData {
  eventName: string;
  location: string;
  dateTime: string;
  endDate?: string;  // Make endDate optional
  attendees: number;
  description: string;
}

// Events API
export const eventsApi = {
  getDashboard: async () => {
    const response = await apiClient.get("/events/dashboard");
    return response.data;
  },
  
  getEvents: async () => {
    const response = await apiClient.get("/events/user");
    return response.data;
  },
  
  getEventStats: async () => {
    const response = await apiClient.get("/events/stats");
    return response.data;
  },
  
  getOngoingEvents: async () => {
    const response = await apiClient.get("/events/ongoing");
    return response.data;
  },
  
  getUpcomingEvents: async () => {
    const response = await apiClient.get("/events/upcoming");
    return response.data;
  },
  
  getPastEvents: async () => {
    const response = await apiClient.get("/events/past");
    return response.data;
  },
  
  getTimelineEvents: async () => {
    const response = await apiClient.get("/events/timeline");
    return response.data;
  },
  
  createEvent: async (eventData: EventCreateData) => {
    const response = await apiClient.post("/events", eventData);
    return response.data;
  },
  
  updateEvent: async (eventId: string, eventData: EventCreateData) => {
    const response = await apiClient.put(`/events/${eventId}`, eventData);
    return response.data;
  },
};

export default apiClient; 