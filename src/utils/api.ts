import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        // Attempt to refresh
        const { data } = await axios.post('http://localhost:5000/api/v1/auth/refresh-token', {
          refreshToken,
        });

        if (data.success && data.data.accessToken) {
          // Update store with new tokens
          setTokens(data.data.accessToken, data.data.refreshToken || refreshToken);
          
          // Replay original request
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, force logout
        useAuthStore.getState().logout();
        toast.error('Sesi Anda telah berakhir, silakan login kembali.');
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just format a unified error message
    // const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server';
    
    // Optional: Only toast if it's not a 401 (since 401 might trigger refresh)
    if (error.response?.status !== 401) {
      // toast.error(message);
    }
    
    return Promise.reject(error);
  }
);
