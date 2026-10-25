export type Role = "RECEPTIONIST" | "DOCTOR" | "PATIENT";

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface loginPayload {
  email: string;
  password: string;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface resetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  code?: string;
}
