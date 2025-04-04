import axios from "axios";
import type { Event } from "./types";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to check if token is about to expire (within 5 minutes)
const isTokenExpiring = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    // If token expires in less than 5 minutes (300 seconds), it's expiring soon
    return decoded.exp < currentTime + 300;
  } catch (error) {
    return true; // If we can't decode the token, assume it's expiring
  }
};

// Function to refresh the token
const refreshToken = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      return response.data.access_token;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Add auth interceptor to include the token in every request
apiClient.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");
  
  // If token exists and is expiring soon, try to refresh it
  if (token && isTokenExpiring(token)) {
    const newToken = await refreshToken();
    if (newToken) {
      token = newToken;
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Add response interceptor to handle 401 errors (expired token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and not already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try refreshing the token
      const newToken = await refreshToken();
      
      if (newToken) {
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Retry the original request
        return apiClient(originalRequest);
      } else {
        // If refresh failed, redirect to login or clear auth state
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }
    
    return Promise.reject(error);
  }
);

// Event data structure for API requests
export interface EventCreateData {
  eventName: string;
  location: string;
  dateTime: string;
  endDate?: string;  // Make endDate optional
  attendees: number;
  description: string;
  sustainable?: boolean; // Optional flag for sustainable event planning
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
  
  getEvent: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}`);
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

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    
    const response = await axios.post(`${API_URL}/auth/login`, formData);
    
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    
    return response.data;
  },
  
  signup: async (userData: { username: string; password: string; firstName: string; lastName: string }) => {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem("token");
  },
  
  refreshToken: async () => {
    return await refreshToken();
  }
};

export default apiClient; 