import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  nia: string;
  roleId: string;
  roleName?: string;
  permissions?: { module: string; action: string }[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Actions
  setTokens: (access: string, refresh: string) => void;
  login: (nia: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,

      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
      },

      login: async (nia, password) => {
        // 1. Authenticate
        const { data } = await api.post('/auth/login', { nia, password });
        
        if (data.success) {
          const { accessToken, refreshToken, user } = data.data;
          
          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });

          // The backend already returns `user.role` containing the role name
          set({
            user: {
              id: user.id,
              name: user.name,
              nia: user.nia,
              roleId: user.roleId || '',
              roleName: user.role,
              permissions: [] // Not strictly needed for UI navigation as RBAC maps it locally
            }
          });
        } else {
          throw new Error(data.message);
        }
      },

      logout: () => {
        // Attempt backend logout if we have a refresh token
        const currentRefresh = get().refreshToken;
        if (currentRefresh) {
          api.post('/auth/logout', { refreshToken: currentRefresh }).catch(() => {});
        }
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'ksr-auth-storage',
    }
  )
);
