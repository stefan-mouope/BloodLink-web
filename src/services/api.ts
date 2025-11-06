import axios from "axios";

// Base URL: set VITE_API_BASE_URL in .env, default to Django local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bloodlinks.onrender.com";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
});

// Simple in-memory token accessors to be wired with Zustand later
let getAccessToken: () => string | null = () => null;
let refreshTokens: () => Promise<boolean> = async () => false;

export const registerAuthInterceptors = (getAccess: () => string | null, refresh: () => Promise<boolean>) => {
  getAccessToken = getAccess;
  refreshTokens = refresh;
};

// Handle single refresh in-flight and queue failed requests
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
type Resolver = (value: unknown) => void;
const pendingQueue: { resolve: Resolver; reject: Resolver }[] = [];

const processQueue = (error: unknown | null) => {
  while (pendingQueue.length) {
    const { resolve, reject } = pendingQueue.shift()!;
    if (error) reject(error);
    else resolve(true);
  }
};

api.interceptors.request.use((config) => {
  const token = getAccessToken?.();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original.__isRetryRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        original.__isRetryRequest = true;
        refreshPromise = refreshTokens()
          .then((ok) => {
            processQueue(ok ? null : new Error("refresh_failed"));
            return ok;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
        (refreshPromise as Promise<boolean>)
          .then((ok) => {
            if (!ok) return reject(error);
            resolve(api(original));
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export type UserType = "donneur" | "docteur" | "banque";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
  user: any; // backend returns role-specific payload
}

export const AuthApi = {
  login: (payload: LoginRequest) => api.post<TokenResponse>("/users/login/", payload).then((r) => r.data),
  refresh: (refresh: string) => api.post<{ access: string }>("/users/token/refresh/", { refresh }).then((r) => r.data),
  register: (payload: any) => api.post<TokenResponse>("/users/register/", payload).then((r) => r.data),
};

// Banks
export interface BankItem {
  id: number;
  nom: string;
  localisation?: string;
}

export const BanksApi = {
  list: () => api.get<BankItem[]>("/banques/").then((r) => r.data),
};


