export type Role = "RECEPTIONIST" | "DOCTOR" | "PATIENT" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  patient?: Record<string, unknown> | null;
  doctor?: Record<string, unknown> | null;
  receptionist?: Record<string, unknown> | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface registerPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface loginPayload {
  email: string;
  password: string;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  code?: string;
}
