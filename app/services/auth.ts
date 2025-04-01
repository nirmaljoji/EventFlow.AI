import axios, { AxiosRequestConfig } from 'axios';
import * as jose from 'jose';
import { logger } from '@/lib/logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const TOKEN_EXPIRY_THRESHOLD_MINUTES = 5; // Refresh token if it expires within 5 minutes

// --- Helper function outside the service ---
// Function to decode JWT and check expiration (remains outside as it doesn't depend on service state)
const isTokenExpiringSoon = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const claims = jose.decodeJwt(token);
    const expirationTime = claims.exp;
    if (!expirationTime) {
      logger.warn('Token does not have an expiration claim.');
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = expirationTime - currentTime;
    const thresholdSeconds = TOKEN_EXPIRY_THRESHOLD_MINUTES * 60;
    logger.info(`Token expires in ${timeToExpire} seconds. Threshold is ${thresholdSeconds} seconds.`);
    return timeToExpire < thresholdSeconds;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return true;
  }
};

// --- Axios Instance ---
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth Service Definition ---
interface LoginCredentials {
  username: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

class AuthService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string | null) => void)[] = [];

  private addRefreshSubscriber(callback: (token: string | null) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  async refreshToken(): Promise<string | null> {
    const currentToken = this.getToken();
    if (!currentToken) {
      logger.error('No token found for refresh.');
      return null;
    }

    logger.info('Attempting to refresh token...');
    this.isRefreshing = true; // Set flag here

    try {
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {}, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const newToken = response.data.access_token;
      if (newToken) {
        logger.info('Token refreshed successfully.');
        localStorage.setItem('token', newToken);
        this.onRefreshed(newToken);
        return newToken;
      } else {
        logger.error('Refresh endpoint did not return a new token.');
        this.logout(); // Use this.logout()
        this.onRefreshed(null); // Notify subscribers about failure
        return null;
      }
    } catch (error) {
      logger.error('Failed to refresh token:', error);
      this.logout(); // Use this.logout()
      this.onRefreshed(null); // Notify subscribers about failure
      return null;
    } finally {
      this.isRefreshing = false; // Reset flag in finally block
    }
  }

  async login(credentials: LoginCredentials) {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    logger.info('Attempting login...');
    try {
      const response = await api.post('/api/auth/login', formData, {
        headers: { 'Content-Type': undefined }
      });
      if (response.data.access_token) {
        logger.info('Login successful, token received.');
        localStorage.setItem('token', response.data.access_token);
      } else {
        logger.warn('Login response did not contain access token.');
      }
      return response.data;
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  async signup(credentials: SignupCredentials) {
    logger.info('Attempting signup...');
    try {
      const response = await api.post('/api/auth/signup', credentials);
      if (response.data.access_token) {
        logger.info('Signup successful, token received.');
        localStorage.setItem('token', response.data.access_token);
      } else {
        logger.warn('Signup response did not contain access token.');
      }
      return response.data;
    } catch (error) {
      logger.error('Signup failed:', error);
      throw error;
    }
  }

  logout() {
    logger.info('Logging out, removing token.');
    localStorage.removeItem('token');
    // Optionally redirect
    // setTimeout(() => window.location.href = '/', 100);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        logger.warn('Stored token is not a valid JWT format.');
        return false;
      };
      // Basic format check is sufficient here, expiry is handled by interceptor/proactive check
      return true;
    } catch (error) {
      logger.error('Error validating token structure:', error);
      return false;
    }
  }

  async checkAndRefreshTokenIfNeeded() {
    const token = this.getToken();
    if (token && isTokenExpiringSoon(token)) {
      logger.info('Proactive check: Token is expiring soon.');
      if (!this.isRefreshing) {
        // No need to set isRefreshing here, refreshToken method handles it
        try {
          await this.refreshToken(); // Call the method
        } catch (error) {
          logger.error('Proactive refresh failed:', error);
        }
      } else {
        logger.info('Proactive check: Refresh already in progress.');
      }
    } else if (token) {
      // logger.info('Proactive check: Token is still valid.'); // Optional: reduce noise
    } else {
      // logger.info('Proactive check: No token found.'); // Optional: reduce noise
    }
  }
}

// Instantiate the service
export const authService = new AuthService();

// --- Axios Interceptors ---
// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    let token = authService.getToken(); // Use service method

    const isAuthPath = config.url?.includes('/api/auth/login') ||
                       config.url?.includes('/api/auth/signup') ||
                       config.url?.includes('/api/auth/refresh-token');

    if (isAuthPath) {
      logger.info(`Skipping token logic for auth path: ${config.url}`);
      return config;
    }

    if (token && isTokenExpiringSoon(token)) {
      logger.info(`Token expiring soon for request to ${config.url}`);
      if (!authService['isRefreshing']) { // Access private member carefully if needed, or rely on refreshToken's internal check
        try {
          token = await authService.refreshToken(); // Call service method
          if (!token) {
            logger.warn('Token refresh failed, rejecting request.');
            return Promise.reject(new Error('Token refresh failed. Please log in again.'));
          }
          logger.info('Token refresh successful, proceeding with request.');
        } catch (refreshError) {
          logger.error('Error during token refresh process:', refreshError);
          return Promise.reject(refreshError);
        }
      } else {
        logger.info(`Refresh in progress, queuing request to ${config.url}`);
        return new Promise((resolve, reject) => {
          authService['addRefreshSubscriber']((newToken) => { // Access private member
            if (newToken) {
              logger.info(`Retrying request to ${config.url} with new token after refresh.`);
              if (config.headers) {
                config.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(config);
            } else {
              logger.warn(`Refresh failed while request to ${config.url} was queued. Rejecting.`);
              reject(new Error('Token refresh failed while request was queued.'));
            }
          });
        });
      }
    }

    if (token && config.headers) {
      logger.info(`Attaching token to request for ${config.url}`);
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && !isAuthPath) {
      logger.warn(`No token available for protected request to ${config.url}.`);
      return Promise.reject(new Error('No authentication token available.'));
    }

    return config;
  },
  (error) => {
    logger.error('Error in request interceptor setup:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest.url?.includes('/api/auth/refresh-token')) {
      logger.warn(`Received 401 Unauthorized for ${originalRequest.url}. Logging out as fallback.`);
      authService.logout(); // Use service method
      // Optionally redirect
      // window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Export the configured api instance if needed elsewhere (e.g., for non-auth related calls)
// export default api;