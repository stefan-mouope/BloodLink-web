import {api} from "@/services/api";
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


