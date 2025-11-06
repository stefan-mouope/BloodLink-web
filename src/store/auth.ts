import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthApi, registerAuthInterceptors } from "@/services/users";

type UserRole = "donneur" | "docteur" | "banque";

export interface AuthUserBase {
  email: string;
  user_type: UserRole;
  is_active?: boolean;
  id?: number;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      async login(email, password) {
        const data = await AuthApi.login({ email, password });
        set({ accessToken: data.access, refreshToken: data.refresh, user: data.user, isAuthenticated: true });
      },
      async register(payload) {
        const data = await AuthApi.register(payload);
        set({ accessToken: data.access, refreshToken: data.refresh, user: data.user, isAuthenticated: true });
      },
      logout() {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      },
      async refresh() {
        const refreshToken = get().refreshToken;
        if (!refreshToken) return false;
        try {
          const res = await AuthApi.refresh(refreshToken);
          set({ accessToken: res.access });
          return true;
        } catch {
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    { name: "auth-store" }
  )
);

// Register axios interceptors using the store's getters
registerAuthInterceptors(
  () => useAuthStore.getState().accessToken,
  () => useAuthStore.getState().refresh()
);


